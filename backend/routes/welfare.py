"""
Welfare Fraud Detection Routes
Integrated from: h4d (Samagra-Setu)

Endpoints:
- GET  /api/welfare/analyze     - Analyze all welfare applicants
- POST /api/welfare/scan        - Scan individual applicant  
- GET  /api/welfare/history     - Get scan history
- GET  /api/welfare/stats       - Get welfare fraud statistics
"""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timezone
import uuid

from core.auth import require_official, require_permission
from core.database import get_database, get_welfare_scans_collection
from core.logging import get_logger, log_request
from core.exceptions import ValidationError, NotFoundError

from services.welfare import WelfareChecker

router = APIRouter(prefix="/api/welfare", tags=["Welfare Fraud Detection"])
logger = get_logger("welfare")


# Request/Response Models
class ApplicantScan(BaseModel):
    applicant_id: str
    name: str
    dob: str  # YYYY-MM-DD
    address: str
    declared_income: float
    asset_flag: Optional[str] = "Standard"


class ScanResult(BaseModel):
    applicant_id: str
    name: str
    declared_income: float
    risk_status: str  # "red", "yellow", "green"
    flags: List[dict]
    ml_fraud_probability: Optional[float] = None
    ml_risk_level: Optional[str] = None
    scanned_at: Optional[str] = None


class BulkAnalysisResponse(BaseModel):
    total_analyzed: int
    high_risk: int
    medium_risk: int
    low_risk: int
    results: List[ScanResult]


@router.get("/analyze", response_model=BulkAnalysisResponse)
@log_request("welfare")
async def analyze_all_applicants(
    user: dict = Depends(require_permission("welfare:read"))
):
    """
    Analyze all welfare applicants against Vahan and Discom databases.
    Returns risk status (Red, Yellow, Green) for each applicant.
    
    Originally: GET /analyze_applicants in h4d
    """
    checker = WelfareChecker()
    results = await checker.analyze_all_applicants()
    
    # Count by risk level
    high_risk = len([r for r in results if r["risk_status"] == "red"])
    medium_risk = len([r for r in results if r["risk_status"] == "yellow"])
    low_risk = len([r for r in results if r["risk_status"] == "green"])
    
    return BulkAnalysisResponse(
        total_analyzed=len(results),
        high_risk=high_risk,
        medium_risk=medium_risk,
        low_risk=low_risk,
        results=results
    )


@router.post("/scan", response_model=ScanResult)
@log_request("welfare")
async def scan_individual_applicant(
    applicant: ApplicantScan,
    user: dict = Depends(require_permission("welfare:write"))
):
    """
    Scan a single applicant for welfare fraud indicators.
    Uses ML model trained on financial intelligence dataset (1,050 records).
    
    Checks against:
    - ML Model (primary)
    - Vahan registry (secondary)
    - Discom database (secondary)
    
    Saves scan result to database for audit trail.
    """
    checker = WelfareChecker()
    result = await checker.scan_applicant({
        "ID": applicant.applicant_id,
        "Name": applicant.name,
        "DOB": applicant.dob,
        "Address": applicant.address,
        "Declared_Income": applicant.declared_income,
        "Asset_Flag": applicant.asset_flag
    })
    
    # Save to database
    db = get_database()
    scan_doc = {
        "id": str(uuid.uuid4()),
        "scanned_by": user["id"],
        "scanned_by_name": user["full_name"],
        **result,
        "scanned_at": datetime.now(timezone.utc).isoformat()
    }
    await db.welfare_scans.insert_one(scan_doc)
    
    return ScanResult(
        applicant_id=result['applicant_id'],
        name=result['name'],
        declared_income=result['declared_income'],
        risk_status=result['risk_status'],
        flags=result['flags'],
        ml_fraud_probability=result.get('ml_fraud_probability'),
        ml_risk_level=result.get('ml_risk_level'),
        scanned_at=scan_doc['scanned_at']
    )


@router.get("/history")
@log_request("welfare")
async def get_scan_history(
    skip: int = 0,
    limit: int = 50,
    risk_status: Optional[str] = None,
    user: dict = Depends(require_permission("welfare:read"))
):
    """
    Get history of welfare fraud scans.
    Filterable by risk status.
    """
    db = get_database()
    
    query = {}
    if risk_status:
        query["risk_status"] = risk_status
    
    scans = await db.welfare_scans.find(
        query, {"_id": 0}
    ).sort("scanned_at", -1).skip(skip).limit(limit).to_list(limit)
    
    total = await db.welfare_scans.count_documents(query)
    
    return {
        "scans": scans,
        "total": total,
        "skip": skip,
        "limit": limit
    }


@router.get("/stats")
@log_request("welfare")
async def get_welfare_stats(
    user: dict = Depends(require_permission("welfare:read"))
):
    """
    Get aggregated welfare fraud statistics.
    """
    db = get_database()
    
    total_scans = await db.welfare_scans.count_documents({})
    red_flags = await db.welfare_scans.count_documents({"risk_status": "red"})
    yellow_flags = await db.welfare_scans.count_documents({"risk_status": "yellow"})
    green_flags = await db.welfare_scans.count_documents({"risk_status": "green"})
    
    # Get recent scans
    recent_scans = await db.welfare_scans.find(
        {}, {"_id": 0}
    ).sort("scanned_at", -1).limit(5).to_list(5)
    
    return {
        "total_scans": total_scans,
        "risk_distribution": {
            "high_risk": red_flags,
            "medium_risk": yellow_flags,
            "low_risk": green_flags
        },
        "fraud_detection_rate": round(red_flags / total_scans * 100, 2) if total_scans > 0 else 0,
        "recent_scans": recent_scans
    }
