"""
Delhi-specific Mock Data Seeder
Adds mock data for:
1. Welfare Fraud Detection (PDS & applicants)
2. PDS Ledger (Blockchain transactions)
3. Lifestyle Mismatch Detection
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime, timezone, timedelta
import random
import uuid
import hashlib
import json
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# ============================================================================
# DELHI-SPECIFIC DATA
# ============================================================================

DELHI_LOCATIONS = {
    "North Delhi": ["Chandni Chowk", "Delhi Gate", "Kasturba Nagar", "Model Town", "Mandi House"],
    "South Delhi": ["Hauz Khas", "Greater Kailash", "Lajpat Nagar", "Malviya Nagar", "Chhatarpur"],
    "East Delhi": ["Preet Vihar", "Kasmere Gate", "Krishnagar", "Seemapuri", "Shahdara"],
    "West Delhi": ["Dwarka", "Uttam Nagar", "Subhash Nagar", "Sadar Bazar", "Raj Nagar"],
    "Central Delhi": ["New Delhi", "Connaught Place", "Barakhamba", "Dilli Gate", "Naraina"]
}

DELHI_RATION_SHOPS = [
    "Daulat Ram Fair Price Shop - Chandni Chowk",
    "Geeta FPS - Hauz Khas",
    "Mahatma Gandhi FPS - Dwarka",
    "Rajendra Prasad Fair Price Shop - Preet Vihar",
    "Indira Gandhi FPS - Malviya Nagar",
    "Pandit Deendayal FPS - Model Town",
    "Swami Vivekananda FPS - Lajpat Nagar",
    "Kalpana Chawla FPS - Greater Kailash",
    "Subhas Chandra Bose FPS - Uttam Nagar",
    "Ashoka Chakra FPS - New Delhi",
]

DELHI_VEHICLES = [
    "Maruti Swift", "Hyundai i20", "Tata Nexon", "Mahindra XUV500",
    "Toyota Innova", "Honda City", "Skoda Rapid", "Volkswagen Polo",
    "Audi A4", "BMW 3 Series", "Mercedes C-Class", "Jaguar XE",
    "Land Rover Evoque", "Porsche 911"
]

DELHI_APPLICANT_NAMES = [
    "Raj Kumar Singh", "Priya Sharma", "Arun Patel", "Divya Gupta",
    "Vikram Reddy", "Anjali Verma", "Suresh Yadav", "Neha Malhotra",
    "Arjun Kapoor", "Pooja Sharma", "Rohit Jain", "Sneha Desai",
    "Amit Saxena", "Kavya Nair", "Sanjay Bhatt", "Meera Chopra",
    "Harpreet Singh", "Yasmin Khan", "Naveen Kumar", "Zara Patel",
    "Rohan Verma", "Ananya Singh", "Deepak Bhat", "Swati Gupta",
    "Varun Malhotra", "Akshara Deshmukh", "Nitin Rao", "Riya Sharma",
    "Karan Mehta", "Avni Kapoor"
]

ELECTRONICS_ITEMS = [
    "Smartphone", "Laptop", "Television", "AC Unit",
    "Washing Machine", "Refrigerator", "Microwave", "Home Theatre",
    "Gaming Console", "Camera", "Smartwatch", "Air Purifier"
]

PDS_ITEMS = [
    "Rice (5kg)", "Wheat Flour (10kg)", "Sugar (1kg)", "Salt (1kg)",
    "Mustard Oil (1L)", "Dal (1kg)", "Kerosene (5L)", "Soap (per kg)"
]

# High-risk income threshold (for lifestyle mismatch)
HIGH_RISK_INCOME = 15000  # Per month
MEDIUM_RISK_INCOME = 25000

# ============================================================================
# WELFARE FRAUD DETECTION DATA
# ============================================================================

async def create_welfare_applicants():
    """Create mock welfare applicants for Delhi with various risk levels."""
    applicants = []
    
    for i in range(80):  # More applicants for better stats
        location_key = random.choice(list(DELHI_LOCATIONS.keys()))
        sub_location = random.choice(DELHI_LOCATIONS[location_key])
        
        applicant_id = f"DLHI{str(i+1).zfill(6)}"
        name = random.choice(DELHI_APPLICANT_NAMES)
        
        # Risk distribution: 60% low, 25% medium, 15% high
        risk_chance = random.random()
        if risk_chance < 0.15:
            risk_status = "red"
            declared_income = random.randint(5000, 12000)
            owns_vehicle = True
            vehicles = random.sample(DELHI_VEHICLES, random.randint(1, 3))
            electricity_bill = random.randint(5000, 15000)
        elif risk_chance < 0.40:
            risk_status = "yellow"
            declared_income = random.randint(10000, 18000)
            owns_vehicle = random.choice([True, False])
            vehicles = random.sample(DELHI_VEHICLES, 1) if owns_vehicle else []
            electricity_bill = random.randint(2000, 5000)
        else:
            risk_status = "green"
            declared_income = random.randint(2000, 12000)
            owns_vehicle = False
            vehicles = []
            electricity_bill = random.randint(500, 2000)
        
        flags = []
        if owns_vehicle:
            flags.append({
                "type": "vehicle_ownership",
                "severity": "high" if risk_status == "red" else "medium",
                "details": f"Owns {len(vehicles)} vehicle(s): {', '.join(vehicles)}"
            })
        
        if electricity_bill > 3000 and declared_income < 15000:
            flags.append({
                "type": "high_electricity",
                "severity": "high" if electricity_bill > 8000 else "medium",
                "details": f"Monthly electricity bill: ₹{electricity_bill}"
            })
        
        if random.random() < 0.15 and risk_status in ["red", "yellow"]:
            flags.append({
                "type": "multiple_applications",
                "severity": "high",
                "details": "Multiple welfare applications detected"
            })
        
        applicant = {
            "id": str(uuid.uuid4()),
            "applicant_id": applicant_id,
            "name": name,
            "dob": f"19{random.randint(60, 90)}-{str(random.randint(1, 12)).zfill(2)}-{str(random.randint(1, 28)).zfill(2)}",
            "address": f"{random.randint(1, 500)} {sub_location}, {location_key}, New Delhi",
            "phone": f"+91-{random.randint(7000000000, 9999999999)}",
            "aadhar_masked": f"XXXX-XXXX-{random.randint(1000, 9999)}",
            "declared_income": declared_income,
            "family_size": random.randint(2, 8),
            "risk_status": risk_status,
            "flags": flags,
            "vahan_records": len(vehicles),
            "discom_bill_monthly": electricity_bill,
            "owns_vehicle": owns_vehicle,
            "vehicles": vehicles,
            "application_date": (datetime.now(timezone.utc) - timedelta(days=random.randint(1, 365))).isoformat(),
            "scanned_at": datetime.now(timezone.utc).isoformat()
        }
        applicants.append(applicant)
    
    await db.welfare_scans.insert_many(applicants)
    print(f"✓ Created {len(applicants)} welfare applicants for Delhi")
    return applicants

# ============================================================================
# PDS LEDGER (BLOCKCHAIN) DATA
# ============================================================================

def hash_block(block: dict) -> str:
    """Calculate SHA-256 hash of a block."""
    block_copy = {k: v for k, v in block.items() if k != "hash" and k != "_id"}
    block_string = json.dumps(block_copy, sort_keys=True)
    return hashlib.sha256(block_string.encode()).hexdigest()

async def create_pds_ledger():
    """Create mock PDS ledger transactions (blockchain)."""
    
    # Delete existing ledger
    await db.pds_ledger.delete_many({})
    
    transactions = []
    previous_hash = "0" * 64
    
    # Genesis block
    genesis = {
        "index": 0,
        "timestamp": (datetime.now(timezone.utc) - timedelta(days=365)).isoformat(),
        "transaction": {
            "shop_id": "GENESIS",
            "dealer_id": "GENESIS",
            "beneficiary_id": "GENESIS",
            "item": "Genesis Block",
            "quantity": 0
        },
        "previous_hash": "0" * 64,
        "added_by": "SYSTEM"
    }
    genesis["hash"] = hash_block(genesis)
    transactions.append(genesis)
    previous_hash = genesis["hash"]
    
    # Create 200+ transactions over past year
    base_date = datetime.now(timezone.utc) - timedelta(days=365)
    
    for i in range(1, 250):
        shop_id = f"DLHI-FPS-{random.randint(1001, 1050)}"
        dealer_id = f"DLHI-DEALER-{random.randint(100, 150)}"
        beneficiary_id = f"DLHI{str(i).zfill(6)}"
        
        item = random.choice(PDS_ITEMS)
        quantity = random.uniform(1, 20)
        
        transaction_date = base_date + timedelta(days=random.randint(0, 365))
        
        block = {
            "index": i,
            "timestamp": transaction_date.isoformat(),
            "transaction": {
                "shop_id": shop_id,
                "dealer_id": dealer_id,
                "beneficiary_id": beneficiary_id,
                "item": item,
                "quantity": round(quantity, 2)
            },
            "previous_hash": previous_hash,
            "added_by": random.choice(["ADMIN", "OPERATOR_001", "OPERATOR_002", "SYSTEM"])
        }
        block["hash"] = hash_block(block)
        transactions.append(block)
        previous_hash = block["hash"]
    
    # Sort by index before inserting
    transactions.sort(key=lambda x: x["index"])
    await db.pds_ledger.insert_many(transactions)
    print(f"✓ Created {len(transactions)} PDS ledger blocks (blockchain)")
    return transactions

# ============================================================================
# LIFESTYLE MISMATCH DETECTION DATA
# ============================================================================

async def create_lifestyle_scans():
    """Create mock lifestyle mismatch detection scans."""
    scans = []
    
    for i in range(100):
        applicant_name = random.choice(DELHI_APPLICANT_NAMES)
        location_key = random.choice(list(DELHI_LOCATIONS.keys()))
        sub_location = random.choice(DELHI_LOCATIONS[location_key])
        
        # Risk distribution: 50% clean, 30% review, 20% critical
        risk_chance = random.random()
        if risk_chance < 0.20:
            integrity_status = "CRITICAL FRAUD"
            risk_score = random.randint(80, 99)
            assets = random.sample(DELHI_VEHICLES, random.randint(2, 4))
            assets.extend(random.sample(ELECTRONICS_ITEMS, random.randint(3, 6)))
            family_cluster = [f"Person_{j}" for j in range(random.randint(2, 6))]
            system_message = "High-risk profile detected. Multiple family members with similar assets. Recommendation: Deep investigation."
        elif risk_chance < 0.50:
            integrity_status = "REVIEW REQUIRED"
            risk_score = random.randint(50, 79)
            assets = random.sample(DELHI_VEHICLES, 1) + random.sample(ELECTRONICS_ITEMS, random.randint(1, 3))
            family_cluster = [f"Person_{j}" for j in range(random.randint(1, 3))]
            system_message = "Some anomalies detected. Manual review recommended."
        else:
            integrity_status = "CLEAN"
            risk_score = random.randint(0, 49)
            assets = random.sample(ELECTRONICS_ITEMS, random.randint(0, 2))
            family_cluster = [f"Person_1"]
            system_message = "Profile appears legitimate. No major red flags detected."
        
        scan = {
            "id": str(uuid.uuid4()),
            "scanned_by": "official@sentinel.gov.in",
            "scanned_by_name": "Demo Official",
            "applicant_name": applicant_name,
            "applicant_dob": f"19{random.randint(60, 90)}-{str(random.randint(1, 12)).zfill(2)}-{str(random.randint(1, 28)).zfill(2)}",
            "applicant_address": f"{random.randint(1, 500)} {sub_location}, {location_key}, New Delhi",
            "integrity_status": integrity_status,
            "risk_score": risk_score,
            "family_cluster": family_cluster,
            "assets_detected": assets,
            "system_message": system_message,
            "scanned_at": (datetime.now(timezone.utc) - timedelta(days=random.randint(1, 180))).isoformat()
        }
        scans.append(scan)
    
    await db.lifestyle_scans.insert_many(scans)
    print(f"✓ Created {len(scans)} lifestyle mismatch scans")
    return scans

# ============================================================================
# MAIN SEEDING FUNCTION
# ============================================================================

async def main():
    print("\n" + "="*70)
    print("🎯 DELHI-SPECIFIC MOCK DATA SEEDING")
    print("="*70 + "\n")
    
    try:
        # Clear existing data
        print("Clearing existing data...")
        await db.welfare_scans.delete_many({})
        await db.lifestyle_scans.delete_many({})
        print("✓ Cleared existing collections\n")
        
        # Seed welfare fraud data
        print("Seeding Welfare Fraud Detection...")
        welfare_apps = await create_welfare_applicants()
        
        # Seed PDS ledger
        print("\nSeeding PDS Ledger (Blockchain)...")
        ledger_blocks = await create_pds_ledger()
        
        # Seed lifestyle mismatch data
        print("\nSeeding Lifestyle Mismatch Detection...")
        lifestyle_scans = await create_lifestyle_scans()
        
        # Print statistics
        print("\n" + "="*70)
        print("📊 SEEDING COMPLETE - DELHI DATA SUMMARY")
        print("="*70)
        print(f"✓ Welfare Applicants:      {len(welfare_apps)}")
        risk_dist = {
            "🔴 High Risk (Red)": len([a for a in welfare_apps if a['risk_status'] == 'red']),
            "🟡 Medium Risk (Yellow)": len([a for a in welfare_apps if a['risk_status'] == 'yellow']),
            "🟢 Low Risk (Green)": len([a for a in welfare_apps if a['risk_status'] == 'green'])
        }
        for status, count in risk_dist.items():
            print(f"   {status:30} {count:3d}")
        
        print(f"\n✓ PDS Ledger Blocks:       {len(ledger_blocks)}")
        print(f"  - Genesis Block:           1")
        print(f"  - Transactions:            {len(ledger_blocks) - 1}")
        
        print(f"\n✓ Lifestyle Scans:         {len(lifestyle_scans)}")
        status_dist = {
            "CRITICAL FRAUD": len([s for s in lifestyle_scans if s['integrity_status'] == 'CRITICAL FRAUD']),
            "REVIEW REQUIRED": len([s for s in lifestyle_scans if s['integrity_status'] == 'REVIEW REQUIRED']),
            "CLEAN": len([s for s in lifestyle_scans if s['integrity_status'] == 'CLEAN'])
        }
        for status, count in status_dist.items():
            print(f"   {status:30} {count:3d}")
        
        print("\n" + "="*70)
        print("✅ All Delhi mock data seeded successfully!")
        print("="*70)
        print("\n📍 Test the portal at: http://localhost:3000")
        print("🔐 Login: official@sentinel.gov.in / demo123\n")
        
    except Exception as e:
        print(f"\n❌ Error during seeding: {str(e)}")
        raise
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())
