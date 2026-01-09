import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime, timezone, timedelta
import random
import uuid
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

INDIAN_DEPARTMENTS = [
    "Public Works Department (PWD)",
    "National Highways Authority of India (NHAI)",
    "Municipal Corporation",
    "Water Supply Department",
    "Irrigation Department",
    "Rural Development Department",
    "Urban Development Authority",
    "State Housing Board"
]

PROJECT_TYPES = [
    {"name": "Road Construction", "desc": "Construction and widening of state highway connecting major cities"},
    {"name": "Bridge Construction", "desc": "Construction of reinforced concrete bridge over river"},
    {"name": "Water Pipeline", "desc": "Installation of water supply pipeline network for residential areas"},
    {"name": "Drainage System", "desc": "Underground drainage system construction and maintenance"},
    {"name": "School Building", "desc": "Construction of government school building with modern facilities"},
    {"name": "Hospital Building", "desc": "Construction of primary health center building"},
    {"name": "Irrigation Canal", "desc": "Construction of irrigation canal for agricultural development"},
    {"name": "Street Lighting", "desc": "Installation of LED street lights across multiple wards"},
    {"name": "Flyover Construction", "desc": "Construction of elevated flyover to ease traffic congestion"},
    {"name": "Park Development", "desc": "Development of public park with landscaping and amenities"}
]

COMPANY_NAMES = [
    "Bharat Infrastructure Ltd",
    "Supreme Constructions Pvt Ltd",
    "Reliable Builders & Engineers",
    "Modern Construction Co",
    "Metro Infrastructure Solutions",
    "Pioneer Engineering Works",
    "Sunrise Constructions",
    "Elite Builders Pvt Ltd",
    "National Projects Corporation",
    "Unity Infrastructure Ltd",
    "Global Construction Services",
    "Apex Engineering Solutions"
]

LOCATIONS = [
    {"city": "Mumbai", "state": "Maharashtra", "lat": 19.0760, "lng": 72.8777},
    {"city": "Delhi", "state": "Delhi", "lat": 28.7041, "lng": 77.1025},
    {"city": "Bangalore", "state": "Karnataka", "lat": 12.9716, "lng": 77.5946},
    {"city": "Hyderabad", "state": "Telangana", "lat": 17.3850, "lng": 78.4867},
    {"city": "Chennai", "state": "Tamil Nadu", "lat": 13.0827, "lng": 80.2707},
    {"city": "Kolkata", "state": "West Bengal", "lat": 22.5726, "lng": 88.3639},
    {"city": "Pune", "state": "Maharashtra", "lat": 18.5204, "lng": 73.8567},
    {"city": "Ahmedabad", "state": "Gujarat", "lat": 23.0225, "lng": 72.5714},
]

REPORT_DESCRIPTIONS = [
    "The construction quality appears substandard. Poor materials being used.",
    "Work has been halted for over 2 months with no explanation.",
    "The contractor is not following safety protocols at the site.",
    "Local residents are facing severe inconvenience due to project delays.",
    "Suspiciously rapid approval process for this high-value contract.",
    "Materials delivered do not match specifications in the tender.",
    "Workers at site report irregular payment from contractor.",
    "No proper site supervision observed during multiple visits.",
    "Budget appears inflated compared to similar projects in the area.",
    "Duplicate tender documents found with minor modifications."
]

async def create_vendors():
    vendors = []
    for i, company in enumerate(COMPANY_NAMES):
        vendor_id = str(uuid.uuid4())
        vendor = {
            "id": vendor_id,
            "company_name": company,
            "registration_number": f"CIN-{random.randint(100000, 999999)}",
            "contact_person": f"Director {i+1}",
            "email": f"contact@{company.lower().replace(' ', '').replace('&', '')}. com",
            "phone": f"+91-{random.randint(7000000000, 9999999999)}",
            "established_year": random.randint(1990, 2015),
            "risk_score": random.randint(20, 85),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        vendors.append(vendor)
    
    await db.vendors.insert_many(vendors)
    print(f"Created {len(vendors)} vendors")
    return vendors

async def create_contracts(vendors):
    contracts = []
    num_contracts = 40
    
    for i in range(num_contracts):
        project_type = random.choice(PROJECT_TYPES)
        location = random.choice(LOCATIONS)
        department = random.choice(INDIAN_DEPARTMENTS)
        vendor = random.choice(vendors)
        
        contract_value = random.randint(50, 5000) * 100000
        original_budget = contract_value
        
        if random.random() < 0.3:
            contract_value = int(original_budget * random.uniform(1.1, 1.5))
        
        start_date = datetime.now(timezone.utc) - timedelta(days=random.randint(180, 730))
        duration_days = random.randint(180, 540)
        expected_completion = start_date + timedelta(days=duration_days)
        
        status_options = ["ongoing", "ongoing", "ongoing", "delayed", "completed"]
        status = random.choice(status_options)
        
        actual_completion = None
        if status == "completed":
            delay = random.randint(-30, 90)
            actual_completion = expected_completion + timedelta(days=delay)
        elif status == "delayed":
            pass
        
        bidder_count = random.choices([1, 2, 3, 4, 5], weights=[0.15, 0.25, 0.30, 0.20, 0.10])[0]
        
        contract_id = str(uuid.uuid4())
        contract = {
            "id": contract_id,
            "project_name": f"{project_type['name']} - {location['city']}",
            "description": project_type['desc'],
            "department": department,
            "contractor_id": vendor['id'],
            "contractor_name": vendor['company_name'],
            "contract_value": contract_value,
            "original_budget": original_budget,
            "location": location,
            "start_date": start_date.isoformat(),
            "expected_completion": expected_completion.isoformat(),
            "actual_completion": actual_completion.isoformat() if actual_completion else None,
            "status": status,
            "bidder_count": bidder_count,
            "tender_publish_date": (start_date - timedelta(days=60)).isoformat(),
            "tender_close_date": (start_date - timedelta(days=30)).isoformat(),
            "audit_status": "pending",
            "fraud_risk_score": 0,
            "flags": {},
            "created_at": start_date.isoformat()
        }
        
        contracts.append(contract)
    
    await db.contracts.insert_many(contracts)
    print(f"Created {len(contracts)} contracts")
    return contracts

async def create_citizen_reports(contracts):
    reports = []
    num_reports = 20
    
    high_risk_contracts = [c for c in contracts if c.get('bidder_count') == 1 or c.get('status') == 'delayed']
    pool = high_risk_contracts if high_risk_contracts else contracts
    sample_size = min(num_reports, len(pool))
    selected_contracts = random.sample(pool, sample_size) if sample_size > 0 else []
    
    for contract in selected_contracts:
        report_id = str(uuid.uuid4())
        report = {
            "id": report_id,
            "project_id": contract['id'],
            "description": random.choice(REPORT_DESCRIPTIONS),
            "location": contract['location'],
            "file_url": None,
            "is_anonymous": True,
            "created_at": (datetime.now(timezone.utc) - timedelta(days=random.randint(1, 90))).isoformat(),
            "status": "submitted"
        }
        reports.append(report)
    
    if reports:
        await db.citizen_reports.insert_many(reports)
    print(f"Created {len(reports)} citizen reports")
    return reports

async def calculate_fraud_scores(contracts, vendors, reports):
    from fraud_detection import FraudDetectionEngine
    
    engine = FraudDetectionEngine()
    
    anomaly_results = engine.detect_cost_anomaly(contracts)
    similarity_results = engine.detect_tender_similarity(contracts)
    
    for contract in contracts:
        vendor = next((v for v in vendors if v['id'] == contract['contractor_id']), {})
        
        flags = engine.detect_rule_based_flags(contract, vendor, contracts)
        
        anomaly_data = anomaly_results.get(contract['id'], {})
        similarity_data = similarity_results.get(contract['id'], {})
        
        citizen_reports_count = len([r for r in reports if r['project_id'] == contract['id']])
        
        risk_data = engine.calculate_fraud_risk_score(
            contract, flags, anomaly_data, similarity_data, citizen_reports_count
        )
        
        await db.contracts.update_one(
            {"id": contract['id']},
            {"$set": {
                "fraud_risk_score": risk_data['fraud_risk_score'],
                "risk_level": risk_data['risk_level'],
                "fraud_explanations": risk_data['explanations'],
                "flags": risk_data['flags']
            }}
        )
    
    print("Calculated fraud risk scores for all contracts")

async def create_demo_official():
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    
    user_id = str(uuid.uuid4())
    demo_user = {
        "id": user_id,
        "email": "official@sentinel.gov.in",
        "hashed_password": pwd_context.hash("demo123"),
        "full_name": "Demo Official",
        "role": "official",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(demo_user)
    print(f"Created demo official user: official@sentinel.gov.in / demo123")

async def main():
    print("Seeding database with demo data...")
    
    await db.vendors.delete_many({})
    await db.contracts.delete_many({})
    await db.citizen_reports.delete_many({})
    await db.users.delete_many({})
    await db.audit_actions.delete_many({})
    
    vendors = await create_vendors()
    contracts = await create_contracts(vendors)
    reports = await create_citizen_reports(contracts)
    await calculate_fraud_scores(contracts, vendors, reports)
    await create_demo_official()
    
    print("\nDatabase seeded successfully!")
    print(f"- {len(vendors)} vendors")
    print(f"- {len(contracts)} contracts")
    print(f"- {len(reports)} citizen reports")
    print(f"- 1 demo official user")
    print("\nDemo Login: official@sentinel.gov.in / demo123")

if __name__ == "__main__":
    asyncio.run(main())
    client.close()