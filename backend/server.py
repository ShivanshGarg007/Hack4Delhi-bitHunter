from fastapi import FastAPI, APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
import jwt
import json
from supabase import create_client, Client
import io

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Sentinel: Public Integrity Platform API")
api_router = APIRouter(prefix="/api")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

JWT_SECRET = os.environ.get('JWT_SECRET')
JWT_ALGORITHM = os.environ.get('JWT_ALGORITHM', 'HS256')

SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.environ.get('SUPABASE_SERVICE_KEY')
SUPABASE_BUCKET = os.environ.get('SUPABASE_BUCKET', 'citizen-reports')

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class CitizenReportCreate(BaseModel):
    project_id: str
    description: str
    location: Optional[dict] = None
    is_anonymous: bool = True

class AuditAction(BaseModel):
    action: str
    notes: Optional[str] = None

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=7)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

@api_router.post("/auth/register", response_model=Token)
async def register(user_data: UserRegister):
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    hashed_password = pwd_context.hash(user_data.password)
    
    user_doc = {
        "id": user_id,
        "email": user_data.email,
        "hashed_password": hashed_password,
        "full_name": user_data.full_name,
        "role": "official",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user_doc)
    
    access_token = create_access_token({"sub": user_id, "email": user_data.email})
    
    user_response = {k: v for k, v in user_doc.items() if k != "hashed_password" and k != "_id"}
    
    return Token(access_token=access_token, token_type="bearer", user=user_response)

@api_router.post("/auth/login", response_model=Token)
async def login(user_data: UserLogin):
    user = await db.users.find_one({"email": user_data.email})
    if not user or not pwd_context.verify(user_data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = create_access_token({"sub": user["id"], "email": user["email"]})
    
    user_response = {k: v for k, v in user.items() if k != "hashed_password" and k != "_id"}
    
    return Token(access_token=access_token, token_type="bearer", user=user_response)

@api_router.get("/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return current_user

@api_router.get("/citizen/projects")
async def get_citizen_projects(location: Optional[str] = None, status: Optional[str] = None, skip: int = 0, limit: int = 50):
    query = {}
    if status:
        query["status"] = status
    
    projects = await db.contracts.find(query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    
    for project in projects:
        project["is_flagged"] = project.get("fraud_risk_score", 0) > 60
    
    return {"projects": projects, "total": len(projects)}

@api_router.get("/citizen/projects/{project_id}")
async def get_citizen_project_detail(project_id: str):
    project = await db.contracts.find_one({"id": project_id}, {"_id": 0})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    reports = await db.citizen_reports.find({"project_id": project_id}, {"_id": 0}).to_list(100)
    
    project["citizen_reports"] = reports
    project["is_flagged"] = project.get("fraud_risk_score", 0) > 60
    
    return project

@api_router.post("/citizen/reports")
async def submit_citizen_report(
    project_id: str = Form(...),
    description: str = Form(...),
    location: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    report_id = str(uuid.uuid4())
    file_url = None
    
    if file:
        try:
            file_content = await file.read()
            file_path = f"reports/{report_id}/{file.filename}"
            
            res = supabase.storage.from_(SUPABASE_BUCKET).upload(
                path=file_path,
                file=file_content,
                file_options={"content-type": file.content_type}
            )
            
            file_url = f"{SUPABASE_URL}/storage/v1/object/public/{SUPABASE_BUCKET}/{file_path}"
        except Exception as e:
            logger.error(f"File upload failed: {e}")
    
    location_data = json.loads(location) if location else None
    
    report_doc = {
        "id": report_id,
        "project_id": project_id,
        "description": description,
        "location": location_data,
        "file_url": file_url,
        "is_anonymous": True,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "status": "submitted"
    }
    
    await db.citizen_reports.insert_one(report_doc)
    
    return {"message": "Report submitted successfully", "report_id": report_id}

@api_router.get("/official/dashboard")
async def get_official_dashboard(current_user: dict = Depends(get_current_user)):
    total_contracts = await db.contracts.count_documents({})
    high_risk = await db.contracts.count_documents({"fraud_risk_score": {"$gte": 70}})
    medium_risk = await db.contracts.count_documents({"fraud_risk_score": {"$gte": 40, "$lt": 70}})
    pending_audits = await db.contracts.count_documents({"audit_status": "pending"})    
    total_reports = await db.citizen_reports.count_documents({})
    
    fraud_categories = {
        "contract_fraud": {
            "total_flagged": high_risk,
            "trend": "+12%",
            "highest_risk": await db.contracts.find_one({"fraud_risk_score": {"$gte": 70}}, {"_id": 0, "project_name": 1, "fraud_risk_score": 1}, sort=[("fraud_risk_score", -1)])
        },
        "procurement_fraud": {
            "total_flagged": await db.contracts.count_documents({"flags.single_bidder": True}),
            "trend": "+8%",
            "highest_risk": None
        },
        "spending_anomalies": {
            "total_flagged": await db.contracts.count_documents({"flags.cost_anomaly": True}),
            "trend": "+15%",
            "highest_risk": None
        },
        "vendor_risk": {
            "total_flagged": await db.vendors.count_documents({"risk_score": {"$gte": 60}}),
            "trend": "+5%",
            "highest_risk": None
        }
    }
    
    return {
        "total_contracts": total_contracts,
        "high_risk_contracts": high_risk,
        "medium_risk_contracts": medium_risk,
        "pending_audits": pending_audits,
        "total_citizen_reports": total_reports,
        "fraud_categories": fraud_categories
    }

@api_router.get("/official/contracts")
async def get_contracts(current_user: dict = Depends(get_current_user), risk_filter: Optional[str] = None, skip: int = 0, limit: int = 50):
    query = {}
    if risk_filter == "high":
        query["fraud_risk_score"] = {"$gte": 70}
    elif risk_filter == "medium":
        query["fraud_risk_score"] = {"$gte": 40, "$lt": 70}
    elif risk_filter == "low":
        query["fraud_risk_score"] = {"$lt": 40}
    
    contracts = await db.contracts.find(query, {"_id": 0}).sort("fraud_risk_score", -1).skip(skip).limit(limit).to_list(limit)
    
    return {"contracts": contracts, "total": len(contracts)}

@api_router.get("/official/contracts/{contract_id}")
async def get_contract_detail(contract_id: str, current_user: dict = Depends(get_current_user)):
    contract = await db.contracts.find_one({"id": contract_id}, {"_id": 0})
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    
    vendor = await db.vendors.find_one({"id": contract.get("contractor_id")}, {"_id": 0})
    reports = await db.citizen_reports.find({"project_id": contract_id}, {"_id": 0}).to_list(100)
    audit_actions = await db.audit_actions.find({"contract_id": contract_id}, {"_id": 0}).sort("created_at", -1).to_list(50)
    
    contract["vendor_details"] = vendor
    contract["citizen_reports"] = reports
    contract["audit_history"] = audit_actions
    
    return contract

@api_router.post("/official/contracts/{contract_id}/audit-action")
async def create_audit_action(contract_id: str, action: AuditAction, current_user: dict = Depends(get_current_user)):
    contract = await db.contracts.find_one({"id": contract_id})
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    
    action_doc = {
        "id": str(uuid.uuid4()),
        "contract_id": contract_id,
        "action": action.action,
        "notes": action.notes,
        "officer_id": current_user["id"],
        "officer_name": current_user["full_name"],
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.audit_actions.insert_one(action_doc)
    
    await db.contracts.update_one(
        {"id": contract_id},
        {"$set": {"audit_status": action.action, "last_audit_date": datetime.now(timezone.utc).isoformat()}}
    )
    
    return {"message": "Audit action recorded", "action_id": action_doc["id"]}

@api_router.get("/official/vendors")
async def get_vendors(current_user: dict = Depends(get_current_user), skip: int = 0, limit: int = 50):
    vendors = await db.vendors.find({}, {"_id": 0}).sort("risk_score", -1).skip(skip).limit(limit).to_list(limit)
    
    for vendor in vendors:
        vendor["total_contracts"] = await db.contracts.count_documents({"contractor_id": vendor["id"]})
        vendor["delayed_projects"] = await db.contracts.count_documents({
            "contractor_id": vendor["id"],
            "status": "delayed"
        })
    
    return {"vendors": vendors, "total": len(vendors)}

@api_router.get("/official/vendors/{vendor_id}")
async def get_vendor_detail(vendor_id: str, current_user: dict = Depends(get_current_user)):
    vendor = await db.vendors.find_one({"id": vendor_id}, {"_id": 0})
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    
    contracts = await db.contracts.find({"contractor_id": vendor_id}, {"_id": 0}).to_list(100)
    
    vendor["contracts"] = contracts
    vendor["total_contracts"] = len(contracts)
    vendor["delayed_projects"] = len([c for c in contracts if c.get("status") == "delayed"])
    vendor["total_value"] = sum(c.get("contract_value", 0) for c in contracts)
    
    return vendor

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()