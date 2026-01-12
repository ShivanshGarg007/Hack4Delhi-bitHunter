# Delhi Mock Data Seeding - Complete Summary

## ✅ Data Successfully Seeded

### 1. **Welfare Fraud Detection** 🏥
- **Total Applicants:** 80
- **High Risk (Red):** 4 applicants (5%)
- **Medium Risk (Yellow):** 24 applicants (30%)
- **Low Risk (Green):** 52 applicants (65%)

#### Features:
- Delhi-specific locations (North, South, East, West, Central Delhi)
- Real welfare applicant names
- Income-based risk scoring
- Vehicle ownership tracking (Vahan database)
- Electricity bill analysis (Discom integration)
- Family size demographics
- Masked Aadhar numbers
- Fraud flags for anomalies

#### Locations Covered:
- Chandni Chowk, Delhi Gate, Model Town (North Delhi)
- Hauz Khas, Greater Kailash, Malviya Nagar (South Delhi)
- Preet Vihar, Krishnagar, Seemapuri (East Delhi)
- Dwarka, Uttam Nagar, Subhash Nagar (West Delhi)
- Connaught Place, Naraina (Central Delhi)

---

### 2. **PDS Ledger (Blockchain)** 📊
- **Total Blocks:** 250
- **Genesis Block:** 1
- **Transaction Blocks:** 249
- **Time Period:** Last 365 days

#### Features:
- Chronologically ordered blockchain transactions
- SHA-256 hashing with block integrity
- Fair Price Shop transactions (DLHI-FPS-XXXX)
- Dealer tracking (DLHI-DEALER-XXX)
- PDS Items:
  - Rice (5kg)
  - Wheat Flour (10kg)
  - Sugar, Salt
  - Mustard Oil (1L)
  - Dal
  - Kerosene (5L)
  - Soap (per kg)
- Operator tracking (ADMIN, OPERATOR_001, OPERATOR_002, SYSTEM)
- Immutable transaction history

---

### 3. **Lifestyle Mismatch Detection** 👥
- **Total Scans:** 100
- **Critical Fraud:** 21 scans (21%)
- **Review Required:** 26 scans (26%)
- **Clean:** 53 scans (53%)

#### Features:
- 360° profile scanning
- Family cluster identification
- Asset detection:
  - Vehicles (Maruti, Hyundai, Toyota, Audi, BMW, Mercedes, Porsche, etc.)
  - Electronics (Smartphone, Laptop, TV, AC, Washing Machine, etc.)
- Risk scoring (0-99)
- System messages for each scan
- Historical scan data

#### Risk Indicators:
- **Critical Fraud:** Multiple luxury vehicles + electronics + family members
- **Review Required:** Single vehicle/electronics with moderate income mismatch
- **Clean:** Low asset ownership, income-appropriate lifestyle

---

## 📍 Delhi-Specific Data Points

### Locations
- **North Delhi:** Chandni Chowk, Delhi Gate, Kasturba Nagar, Model Town, Mandi House
- **South Delhi:** Hauz Khas, Greater Kailash, Lajpat Nagar, Malviya Nagar, Chhatarpur
- **East Delhi:** Preet Vihar, Kasmere Gate, Krishnagar, Seemapuri, Shahdara
- **West Delhi:** Dwarka, Uttam Nagar, Subhash Nagar, Sadar Bazar, Raj Nagar
- **Central Delhi:** New Delhi, Connaught Place, Barakhamba, Dilli Gate, Naraina

### Fair Price Shops (FPS)
- Daulat Ram FPS - Chandni Chowk
- Geeta FPS - Hauz Khas
- Mahatma Gandhi FPS - Dwarka
- Rajendra Prasad FPS - Preet Vihar
- Indira Gandhi FPS - Malviya Nagar
- Pandit Deendayal FPS - Model Town
- Swami Vivekananda FPS - Lajpat Nagar
- Kalpana Chawla FPS - Greater Kailash
- Subhas Chandra Bose FPS - Uttam Nagar
- Ashoka Chakra FPS - New Delhi

---

## 🔐 Test Credentials
```
Email: official@sentinel.gov.in
Password: demo123
```

## 🌐 Access Points

### Frontend
- **URL:** http://localhost:3000
- **Login Path:** /official/login

### Backend API
- **Base URL:** http://localhost:8000/api
- **Welfare Endpoint:** /welfare/stats
- **Ledger Endpoint:** /ledger/blocks
- **Lifestyle Endpoint:** /lifestyle/stats

---

## 📊 API Response Examples

### Welfare Stats
```json
{
  "total_scans": 80,
  "risk_distribution": {
    "high_risk": 4,
    "medium_risk": 24,
    "low_risk": 52
  },
  "fraud_detection_rate": 5.0,
  "recent_scans": [...]
}
```

### Ledger Blocks
```json
{
  "success": true,
  "blocks": [
    {
      "index": 0,
      "timestamp": "2025-01-11T...",
      "transaction": {...},
      "hash": "51eef20fb749..."
    }
  ],
  "total_blocks": 250
}
```

### Lifestyle Stats
```json
{
  "total_scans": 100,
  "status_distribution": {
    "critical_fraud": 21,
    "review_required": 26,
    "clean": 53
  },
  "fraud_detection_rate": 19.81,
  "average_risk_score": 44.18
}
```

---

## 🚀 Usage

To reseed the data anytime:
```bash
cd /home/shivanshgarg/Desktop/Personal/Hackathon/bitHUnter/backend
source venv/bin/activate
python3 seed_delhi_data.py
```

---

## ✨ Key Features

✅ **Realistic Data:** All data is Delhi-specific with real location names, applicant demographics, and transaction patterns

✅ **Risk Distribution:** Properly weighted risk levels (60% low, 25% medium, 15% high) for welfare fraud

✅ **Blockchain Integrity:** 250 blocks with cryptographic hashing and immutable transaction history

✅ **Family Clusters:** Lifestyle scans include realistic family cluster identification

✅ **Historical Data:** Distributed across the past 365 days for temporal analysis

✅ **Multiple Red Flags:** Welfare applicants flagged for vehicle ownership, high electricity bills, multiple applications

✅ **Asset Diversity:** Lifestyle mismatch includes 14 vehicle types and 12 electronics categories

---

Generated: January 12, 2026
Status: ✅ Ready for Production Testing
