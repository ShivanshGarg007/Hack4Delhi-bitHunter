# Testing Guide for bitHunter Modules

## 1. Welfare Scan Individual Module

### Fixed Issues
- ✅ **toast.error is not a function** - Fixed by adding convenience methods (`toast.error()`, `toast.success()`) to the `use-toast` hook
- ✅ **404 Not Found on API endpoint** - Fixed by correcting the Authorization header in the axios request

### How to Test Welfare Scan

Navigate to: **http://localhost:3000 > Official Dashboard > Welfare > Scan Individual**

#### Test Case 1: HIGH FRAUD (Red Flag)
- **Applicant ID:** `WELFARE001`
- **Name:** `Test High Fraud`
- **DOB:** `1980-01-01`
- **Address:** `Delhi`
- **Declared Income:** `₹200,000`
- **Asset Flag:** `Luxury Car`

**Expected Result:**
```
Risk Status: RED
Fraud Probability: ~80%
Flags: 
  - Possesses Luxury Car
  - Asset exceeds income capacity
ML Risk Level: HIGH
```

#### Test Case 2: LOW FRAUD (Green - Clean)
- **Applicant ID:** `WELFARE002`
- **Name:** `Test Low Fraud`
- **DOB:** `1975-05-15`
- **Address:** `Mumbai`
- **Declared Income:** `₹500,000`
- **Asset Flag:** `Standard`

**Expected Result:**
```
Risk Status: GREEN
Fraud Probability: ~0.1%
Flags: (empty)
ML Risk Level: LOW
```

#### Test Case 3: MEDIUM INCOME WITH ASSET
- **Applicant ID:** `WELFARE003`
- **Name:** `Test Medium Case`
- **DOB:** `1985-03-20`
- **Address:** `Bangalore`
- **Declared Income:** `₹800,000`
- **Asset Flag:** `Mutual Funds > 5L`

**Expected Result:**
```
Risk Status: GREEN
Fraud Probability: ~1.4%
Flags: (empty - income sufficient for this asset)
ML Risk Level: LOW
```

---

## 2. Lifestyle Scan Module

### How It Works
The lifestyle scanner checks applicants against three databases:
1. **Civil Registry** - Master list of citizens (family clusters)
2. **Vahan Registry** - Vehicle ownership records
3. **Discom Data** - Electricity consumption patterns

### Fraud Scoring System
- **Risk Score 0** → CLEAN (Eligible)
- **Risk Score 1-49** → REVIEW REQUIRED (Manual verification needed)
- **Risk Score ≥50** → CRITICAL FRAUD (Ineligible)

### Risk Increments
- Vehicle owned by family member: **+50 points** 🚗
- High electricity bill (>₹8000/month): **+40 points** ⚡

### How to Get HIGH FRAUD Score in Lifestyle

Navigate to: **http://localhost:3000 > Official Dashboard > Lifestyle > Scan**

#### Test Case 1: CRITICAL FRAUD (Use a name from Civil Registry with family assets)

**Option A: Turvi Lamba's Family (Mercedes Owner)**
- **Name:** `Turvi Lamba`
- **DOB:** `1990-05-20`
- **Address:** `Mumbai`

**Expected Result:**
```
Status: CRITICAL FRAUD
Risk Score: 50+
Assets Detected: 
  - Turvi Lamba owns Mercedes Benz S-Class
Message: "Ineligible due to high-value assets linked to family."
```

**Option B: Nathaniel Choudhury's Family (Has members with vehicles)**
- **Name:** `Nathaniel Choudhury`
- **DOB:** `1992-07-15`
- **Address:** `321, Chahal Circle, Patna 133890`

**Expected Result:**
```
Status: CRITICAL FRAUD
Risk Score: 50+
Assets Detected:
  - Family Member (Gunbir Choudhury) owns Hyundai Creta
Message: "Ineligible due to high-value assets linked to family."
```

**Option C: Raagini Karpe (Audi Owner)**
- **Name:** `Raagini Karpe`
- **DOB:** `1969-02-20`
- **Address:** `H.No. 031, Narayanan Nagar, Kottayam-473829`

**Expected Result:**
```
Status: CRITICAL FRAUD
Risk Score: 50+
Assets Detected:
  - Raagini Karpe owns Audi A4
Message: "Ineligible due to high-value assets linked to family."
```

#### Test Case 2: CLEAN (Unknown applicant - no prior records)
- **Name:** `Unknown Person`
- **DOB:** `1988-06-10`
- **Address:** `Hyderabad`

**Expected Result:**
```
Status: CLEAN
Risk Score: 0
Family Cluster: ["Unknown Person"]
Assets Detected: (empty)
Message: "No prior financial records found. Applicant is ELIGIBLE for enrollment."
```

#### Test Case 3: REVIEW REQUIRED (Partial match)
- **Name:** `Turvi` (partial name)
- **DOB:** `1990-05-20`
- **Address:** `Mumbai`

**Expected Result:**
```
Status: REVIEW REQUIRED or CRITICAL FRAUD
(Will match to Turvi Lamba if family has assets)
Match Type: PREFIX_MATCH or FUZZY_MATCH
```

---

## 3. Available Test Names (Civil Registry)

### High-Risk Names (Have Vehicle Assets)
| Name | DOB | Address | Vehicle | Risk |
|------|-----|---------|---------|------|
| Turvi Lamba | 1990-05-20 | Mumbai | Mercedes Benz S-Class | CRITICAL |
| Gunbir Choudhury | 1969-06-16 | 321, Chahal Circle, Patna | Hyundai Creta | CRITICAL |
| Raagini Karpe | 1969-02-20 | H.No. 031, Narayanan Nagar, Kottayam | Audi A4 | CRITICAL |
| Vidhi Borra | 1955-07-25 | H.No. 801, Ganesan Ganj, Shivpuri | (Spouse/Family) | CRITICAL |

### Clean Names (No Prior Records)
- Any name NOT in the civil registry will return CLEAN status
- Examples: `John Smith`, `Random Person`, `Test User`, etc.

---

## 4. Backend Health Check

Verify the backend is running:
```bash
curl http://localhost:8000/health
```

Check specific endpoints:
```bash
# Welfare scan (requires auth)
curl -X POST http://localhost:8000/api/welfare/scan \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"applicant_id":"TEST","name":"Test","dob":"1980-01-01","address":"Delhi","declared_income":250000,"asset_flag":"Luxury Car"}'

# Lifestyle scan (requires auth)
curl -X POST http://localhost:8000/api/lifestyle/scan \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Turvi Lamba","dob":"1990-05-20","address":"Mumbai"}'
```

---

## 5. Frontend Development Tips

### Console Errors to Ignore
- `DeprecationWarning` about `on_event` - This is a FastAPI notice, not blocking
- CORS warnings during development - Expected in dev environment

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| 404 Not Found on scan | Ensure Authorization header is set with valid token |
| toast not showing | Clear browser cache and hard refresh (Ctrl+Shift+R) |
| No results after scan | Check browser console for network error details |
| "Please fill in all required fields" | Ensure DOB is in YYYY-MM-DD format |

---

## 6. Data File Locations

```
backend/data/
├── civil_registry.csv       (1000+ citizen records)
├── vahan_registry.csv       (500+ vehicle records)
├── discom_data.csv          (electricity consumption)
├── financial_intelligence.csv (1050 records for ML training)
└── seed_delhi_data.csv      (additional test data)
```

---

## 7. ML Model Details (Welfare)

**Model Type:** Random Forest + Gradient Boosting Ensemble

**Features Used:**
- Income Level (5 brackets)
- Age (from DOB)
- Asset Risk Score (0-4 scale)
- Address Complexity
- Income-Asset Mismatch

**Training Data:** 1,050 records from financial_intelligence.csv

**Fraud Definition:**
- High-risk assets (Property >50L, Luxury Car, Mutual Funds >5L) + Low income
- Asset value exceeds declared income capacity

**Model Performance:**
- Test Accuracy: 100%
- Fraud Rate in Data: 1.81%
- Feature Importance: Asset Risk (78%), Income (12%), Age (10%)

---

## 8. Troubleshooting

### If Welfare Scan Returns 404
1. Verify backend running: `ps aux | grep uvicorn`
2. Check token is valid and not expired
3. Ensure you're logged in as an official (`official@sentinel.gov.in`)

### If Lifestyle Scan Returns 404
1. Same as above
2. Verify civil_registry.csv exists in backend/data/

### If Data Not Loading
1. Run seed script: `cd backend && python3 seed_data.py`
2. Restart backend server
3. Clear browser cache

---

## 9. Admin Credentials for Testing

```
Email: official@sentinel.gov.in
Password: demo123
```

---

