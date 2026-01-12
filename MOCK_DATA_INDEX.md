# 📊 Delhi Mock Data - Complete Index

## 🎯 Overview

Your bitHunter website now has comprehensive, Delhi-specific mock data across all three integrated modules:

1. **Welfare Fraud Detection** (h4d)
2. **PDS Ledger** (kawach-ledger) 
3. **Lifestyle Mismatch Detection** (lifestyle_mismatch)

---

## 📁 Documentation Files Created

### Main Documentation
- **`MOCK_DATA_SUMMARY.txt`** - Visual dashboard of all statistics
- **`DELHI_DATA_SEEDING.md`** - Detailed seeding documentation
- **`DELHI_DATA_GUIDE.md`** - Complete navigation guide

### Script
- **`backend/seed_delhi_data.py`** - Reusable seeding script (you can run anytime to reset data)

---

## 📊 Data Summary

| Module | Records | High Risk | Details |
|--------|---------|-----------|---------|
| **Welfare Fraud** | 80 applicants | 4 (5%) | Vehicle ownership, high electricity bills, income mismatches |
| **PDS Ledger** | 250 blocks | - | Blockchain with SHA-256 hashing, 249 transactions |
| **Lifestyle** | 100 scans | 21 (21%) | Family cluster analysis, asset detection, risk scoring |
| **TOTAL** | **430+ records** | **25 high-risk** | Spanning 5 Delhi zones with realistic locations |

---

## 🎓 What Each Module Contains

### 1. Welfare Fraud Detection 🏥
**80 Applicants with:**
- Risk classification (High/Medium/Low)
- Vehicle ownership records
- Monthly electricity bills
- Family demographics
- Fraud flags and indicators
- Delhi locations (5 zones, 25+ neighborhoods)

**High-Risk Examples:**
- Priya Sharma: Owns Mercedes C-Class + Land Rover with ₹5,102/month income
- Ananya Singh: Multiple vehicles + ₹12,586 electricity bill with ₹8,878 income

### 2. PDS Ledger (Blockchain) 📦
**250 Blocks containing:**
- Genesis block + 249 transactions
- SHA-256 cryptographic hashing
- Fair Price Shop (FPS) distributions
- Beneficiary tracking
- PDS items: Rice, Wheat, Sugar, Oil, Kerosene, Soap
- Time-distributed transactions (365 days)

**Features:**
- Immutable transaction history
- Operator audit trails
- Previous hash linking (tamper-proof)

### 3. Lifestyle Mismatch 👥
**100 Scans with:**
- Integrity status (Critical/Review/Clean)
- Risk scores (0-99)
- Family cluster identification
- Asset detection (14 vehicle types + 12 electronics)
- System recommendations
- Delhi locations with specific addresses

**High-Risk Example:**
- Anjali Verma: Score 98/99, owns Porsche + Mercedes + Hyundai with 4-member family cluster

---

## 🚀 Quick Start

### 1. Run the Seeding Script
```bash
cd /home/shivanshgarg/Desktop/Personal/Hackathon/bitHUnter/backend
source venv/bin/activate
python3 seed_delhi_data.py
```

Output:
```
✓ Created 80 welfare applicants for Delhi
✓ Created 250 PDS ledger blocks (blockchain)
✓ Created 100 lifestyle mismatch scans
✅ All Delhi mock data seeded successfully!
```

### 2. Start the Application
```bash
# Terminal 1: Backend
cd backend
source venv/bin/activate
python3 server.py

# Terminal 2: Frontend
cd frontend
npm start
```

### 3. Login to Dashboard
- **URL:** http://localhost:3000
- **Email:** `official@sentinel.gov.in`
- **Password:** `demo123`

### 4. Navigate Modules
- **Welfare:** See 80 applicants with risk distribution
- **Ledger:** View 250-block blockchain
- **Lifestyle:** Review 100 integrity scans

---

## 🔍 Example Data Points

### Welfare Applicant
```json
{
  "applicant_id": "DLHI000021",
  "name": "Priya Sharma",
  "address": "497 Barakhamba, Central Delhi, New Delhi",
  "declared_income": 5102,
  "risk_status": "red",
  "vehicles": ["Land Rover Evoque", "Mercedes C-Class"],
  "electricity_bill": 10055,
  "flags": [
    "vehicle_ownership: Owns 2 vehicles",
    "high_electricity: ₹10,055/month"
  ]
}
```

### Ledger Block
```json
{
  "index": 45,
  "timestamp": "2025-08-15T12:34:56Z",
  "transaction": {
    "shop_id": "DLHI-FPS-1025",
    "dealer_id": "DLHI-DEALER-112",
    "beneficiary_id": "DLHI000045",
    "item": "Rice (5kg)",
    "quantity": 15.5
  },
  "hash": "a282853ca63a551a757555d3ad789c517a6d2dff92315ed44524837ddd4c0809"
}
```

### Lifestyle Scan
```json
{
  "applicant_name": "Anjali Verma",
  "applicant_address": "81 Lajpat Nagar, South Delhi",
  "integrity_status": "CRITICAL FRAUD",
  "risk_score": 98,
  "family_cluster": ["Person_0", "Person_1", "Person_2", "Person_3"],
  "assets_detected": [
    "Mercedes C-Class",
    "Porsche 911",
    "Hyundai i20",
    "AC Unit",
    "Microwave"
  ]
}
```

---

## 📍 Delhi Locations Featured

### North Delhi
- Chandni Chowk
- Delhi Gate
- Kasturba Nagar
- Model Town
- Mandi House

### South Delhi
- Hauz Khas
- Greater Kailash
- Lajpat Nagar
- Malviya Nagar
- Chhatarpur

### East Delhi
- Preet Vihar
- Kasmere Gate
- Krishnagar
- Seemapuri
- Shahdara

### West Delhi
- Dwarka
- Uttam Nagar
- Subhash Nagar
- Sadar Bazar
- Raj Nagar

### Central Delhi
- New Delhi
- Connaught Place
- Barakhamba
- Dilli Gate
- Naraina

---

## 🔐 Authentication

All endpoints require Bearer token authentication:

```bash
# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"official@sentinel.gov.in","password":"demo123"}'

# Use token in subsequent requests
curl http://localhost:8000/api/welfare/stats \
  -H "Authorization: Bearer <token>"
```

---

## 📈 API Endpoints

### Welfare Module
```
GET  /api/welfare/stats      - Returns statistics with 80 applicants
GET  /api/welfare/history    - Lists recent scans
GET  /api/welfare/analyze    - Analyze all applicants (bulk)
POST /api/welfare/scan       - Scan individual applicant
```

### Ledger Module
```
GET  /api/ledger/blocks      - Returns 250 blockchain blocks
GET  /api/ledger/stats       - Blockchain statistics
GET  /api/ledger/verify      - Verify chain integrity
POST /api/ledger/transaction - Add new transaction
```

### Lifestyle Module
```
GET  /api/lifestyle/stats    - Returns statistics with 100 scans
GET  /api/lifestyle/history  - Lists recent scans
POST /api/lifestyle/scan     - Perform 360° scan
```

---

## 🎯 Demo Highlights

### Show These High-Risk Cases:
1. **Priya Sharma** (Welfare - Red Flag)
   - 2 luxury vehicles with ₹5K income
   - ₹10K+ monthly electricity bill
   
2. **Ananya Singh** (Welfare - Multiple Flags)
   - Multiple applications detected
   - Vehicle + high electricity
   
3. **Anjali Verma** (Lifestyle - Critical Fraud)
   - Risk score 98/99
   - Porsche + Mercedes ownership
   - 4-member family cluster

### Demonstrate Blockchain:
1. Show 250-block chain
2. Verify hash integrity
3. Explain tamper-proof design
4. Trace transaction history

### Show Analytics:
1. Risk distribution charts
2. Geographic heat maps
3. Temporal trends (365 days)
4. Family cluster networks

---

## ✨ Key Features

✅ **Delhi-Specific** - Real locations, neighborhoods, and realistic demographics
✅ **Risk-Based** - 5% high-risk in welfare, 21% fraud in lifestyle (realistic ratios)
✅ **Blockchain Verified** - 250 immutable blocks with SHA-256 hashing
✅ **Temporal Data** - Distributed across 365 days for trend analysis
✅ **Asset Tracking** - 14 vehicle types, 12+ electronics categories
✅ **Multi-Source** - Vahan (vehicles), Discom (electricity), Aadhar (identity)
✅ **Family Clustering** - Realistic family group analysis
✅ **Operator Audits** - Track who added each transaction

---

## 📝 Important Notes

- All applicant names are fictional but realistic
- Phone numbers follow Indian format (valid examples)
- Aadhar numbers are fully masked for privacy
- Income ranges: ₹2,000-₹25,000/month (realistic welfare range)
- Electricity bills: ₹500-₹15,000/month
- Data is 100% synthetic for testing purposes

---

## 🆘 Troubleshooting

### Data not showing?
```bash
# Reset and reseed
cd backend
source venv/bin/activate
python3 seed_delhi_data.py
```

### API returning empty?
- Check MongoDB connection (MONGO_URL in .env)
- Verify JWT_SECRET is set
- Check auth token is valid

### Frontend not loading data?
- Check CORS is enabled (should be with current setup)
- Verify auth token is in request headers
- Check browser console for errors

---

## 📚 Related Files

- Backend routes: `/backend/routes/welfare.py`, `ledger.py`, `lifestyle.py`
- Services: `/backend/services/welfare.py`, `ledger.py`, `lifestyle.py`
- Database: `/backend/core/database.py`
- Auth: `/backend/core/auth.py`

---

## 📅 Last Updated

**Date:** January 12, 2026
**Status:** ✅ Ready for Production Testing
**Version:** 1.0 (Complete Delhi Data)

---

**Happy Testing! 🚀**

For more details, see:
- `DELHI_DATA_GUIDE.md` - Navigation guide
- `DELHI_DATA_SEEDING.md` - Detailed statistics
- `MOCK_DATA_SUMMARY.txt` - Visual summary
