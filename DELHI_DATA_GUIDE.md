# 🎯 Delhi Mock Data - Dashboard Navigation Guide

## Quick Start

1. **Open Frontend:** http://localhost:3000
2. **Login:** 
   - Email: `official@sentinel.gov.in`
   - Password: `demo123`
3. **Navigate to Portal** → See the three integrated modules

---

## 📋 What You'll See in Each Module

### 1️⃣ WELFARE FRAUD DETECTION MODULE

**Dashboard Stats:**
- ✓ **80 Total Applicants** scanned
- 🔴 **4 High-Risk (5%)** - Vehicle owners with low declared income
- 🟡 **24 Medium-Risk (30%)** - Some anomalies, require review
- 🟢 **52 Low-Risk (65%)** - Clean profiles

**Example High-Risk Cases:**
- **Priya Sharma** - Owns Mercedes C-Class + Land Rover Evoque with declared income of only ₹5,102/month
  - Location: Barakhamba, Central Delhi
  - Electricity Bill: ₹10,055/month (extreme mismatch)
  - Red Flags: Vehicle ownership, High electricity consumption

- **Ananya Singh** - Owns Audi A4 + Maruti Swift with ₹8,878/month income
  - Location: Naraina, Central Delhi
  - Electricity Bill: ₹12,586/month
  - Red Flags: Multiple vehicles, Very high electricity, Multiple applications detected

**Real Locations Featured:**
- Hauz Khas, Greater Kailash, Malviya Nagar (South Delhi)
- Chandni Chowk, Model Town, Delhi Gate (North Delhi)
- Preet Vihar, Krishnagar, Seemapuri (East Delhi)
- Dwarka, Uttam Nagar (West Delhi)
- Connaught Place, Barakhamba, Naraina (Central Delhi)

---

### 2️⃣ PDS LEDGER (BLOCKCHAIN) MODULE

**Blockchain Statistics:**
- ✓ **250 Total Blocks** in the chain
- ✓ **1 Genesis Block** (foundation)
- ✓ **249 Transaction Blocks** recorded over last year
- ✓ **Cryptographically Secured** with SHA-256 hashing

**Transaction Types:**
- Rice (5kg) distributions
- Wheat Flour (10kg) supplies
- Sugar, Salt, Mustard Oil distributions
- Kerosene (5L) allocations
- Soap supplies (per kg)

**Example Transactions:**
```
Block #1 - DLHI-FPS-1012 → Beneficiary DLHI000001 = 5.68L Mustard Oil
Block #2 - DLHI-FPS-1044 → Beneficiary DLHI000002 = 13.39L Kerosene
Block #3 - DLHI-FPS-1008 → Beneficiary DLHI000003 = 14.56kg Rice
```

**Fair Price Shops (FPS):**
- IDs: DLHI-FPS-1001 through DLHI-FPS-1050
- Dealers: DLHI-DEALER-100 through DLHI-DEALER-150
- Operators: ADMIN, OPERATOR_001, OPERATOR_002, SYSTEM

**Features You Can Test:**
- ✓ View complete blockchain ledger
- ✓ Verify block hashing integrity
- ✓ Track transaction history by FPS
- ✓ Monitor beneficiary distributions

---

### 3️⃣ LIFESTYLE MISMATCH DETECTION MODULE

**Scan Statistics:**
- ✓ **100 Total Scans** completed
- 🔴 **21 Critical Fraud (21%)** - Multiple high-value assets + family clusters
- 🟡 **26 Review Required (26%)** - Some anomalies detected
- 🟢 **53 Clean (53%)** - No major red flags

**Example Critical Fraud Case:**
- **Anjali Verma** - Risk Score: 98/99
  - Location: Lajpat Nagar, South Delhi
  - Integrity Status: **CRITICAL FRAUD**
  - Family Cluster: 4 members detected
  - Assets Detected:
    - Mercedes C-Class (Luxury car)
    - Porsche 911 (Ultra-luxury sports car)
    - Hyundai i20 (Mid-range car)
    - AC Unit, Microwave, TV, etc.
  - Recommendation: Deep investigation required

**Asset Categories in Scans:**
- **Vehicles:** Maruti, Hyundai, Tata, Mahindra, Toyota, Honda, Audi, BMW, Mercedes, Porsche, etc.
- **Electronics:** Smartphone, Laptop, TV, AC, Washing Machine, Refrigerator, Microwave, etc.

---

## 🔍 Data Quality Insights

### Welfare Data Characteristics:
✓ Realistic income distribution (₹2,000 - ₹25,000/month)
✓ Vehicle ownership triggers high-risk flags
✓ Electricity bills analyzed for lifestyle mismatch
✓ Family demographics included (2-8 members)
✓ Aadhar partially masked for privacy
✓ Historical application dates (up to 365 days old)

### Ledger Data Characteristics:
✓ Chronologically ordered (Jan 2025 - Jan 2026)
✓ Immutable blockchain structure
✓ Cryptographic integrity verification
✓ Real PDS distribution items
✓ Multiple shops and dealers represented
✓ Proper previous_hash linking

### Lifestyle Data Characteristics:
✓ Risk scores validated (0-99 range)
✓ Family clusters of realistic sizes (1-6 members)
✓ Asset diversity reflecting income levels
✓ System messages with investigation recommendations
✓ Scan timestamps across 180-day period

---

## 📊 Key Statistics at a Glance

| Metric | Welfare | Ledger | Lifestyle |
|--------|---------|--------|-----------|
| **Total Records** | 80 | 250 | 100 |
| **High Risk** | 4 (5%) | - | 21 (21%) |
| **Medium Risk** | 24 (30%) | - | 26 (26%) |
| **Low/Clean** | 52 (65%) | - | 53 (53%) |
| **Locations** | 5 Delhi zones | 50+ FPS | 5 Delhi zones |
| **Time Period** | 365 days | 365 days | 180 days |
| **Unique IDs** | DLHI000001+ | DLHI-FPS-1001+ | Generated UUIDs |

---

## 🎓 What This Data Demonstrates

### Fraud Detection Capabilities:
1. **Multi-source validation** - Cross-referencing income vs. asset ownership
2. **Behavioral analysis** - Family cluster identification
3. **Temporal patterns** - Historical transaction tracking
4. **Risk scoring** - Weighted multi-factor analysis
5. **Immutable records** - Blockchain verification

### Real-World Scenarios Covered:
- 💼 Professionals claiming poverty (luxury car owners)
- 👨‍👩‍👧‍👦 Family clusters with coordinated fraud
- 🏠 Lifestyle-income mismatches (high electricity = AC/heater usage)
- 🚗 Vehicle ownership beyond declared income
- 📱 Multiple concurrent applications (duplicate fraud)
- ⛓️ Tamper-proof transaction history

---

## 🚀 Testing Workflow

**Recommended Navigation Order:**

1. **Login Page** (official@sentinel.gov.in)
   - ↓
2. **Dashboard Overview**
   - ↓
3. **Welfare Module**
   - View stats → Click high-risk applicants → Examine flags
   - ↓
4. **Ledger Module**
   - View blockchain → Verify hash integrity → Trace transactions
   - ↓
5. **Lifestyle Module**
   - View scans → Filter by risk level → Review critical cases
   - ↓
6. **Reports & Analytics** (if available)
   - Export data → Generate insights

---

## 💡 Tips for Demo/Testing

✅ **Highlight these high-risk cases:**
- Priya Sharma (2 luxury vehicles, ₹5K income)
- Ananya Singh (Multiple fraud indicators)
- Anjali Verma (Critical lifestyle fraud, score 98/99)

✅ **Emphasize blockchain security:**
- Show the 250-block chain integrity
- Explain cryptographic hashing prevents tampering
- Reference immutable transaction history

✅ **Show data distribution:**
- Only 5% high-risk in welfare (realistic ratio)
- 21% critical fraud in lifestyle (shows detection capability)
- 249 legitimate transactions in ledger (most are valid)

✅ **Mention Delhi-specific features:**
- Real Delhi locations and neighborhood names
- Authentic PDS shop and dealer IDs
- Realistic family clustering patterns

---

## 📝 Notes

- All applicant names are realistic but fictional
- Phone numbers are valid Indian format examples
- Aadhar numbers are fully masked for privacy
- Electricity bills are in Indian Rupees (₹)
- Timestamps are in UTC ISO format
- All data is synthetic for testing purposes only

---

**Last Updated:** January 12, 2026
**Data Status:** ✅ Ready for Production Testing
**Backend Version:** FastAPI with Motor (Async MongoDB)
**Frontend Version:** React 19 with TailwindCSS
