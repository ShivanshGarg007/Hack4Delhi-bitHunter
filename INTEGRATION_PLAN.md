# Official Portal Integration Plan
## Sentinel: Unified Public Integrity Platform

---

## Executive Summary

This document provides a production-ready integration plan to consolidate three independent fraud detection applications (**h4d**, **kawach-ledger**, **lifestyle_mismatch**) into the existing **Sentinel Official Portal** as native modules.

### Applications Being Integrated

| App | Purpose | Current Backend | Current Frontend |
|-----|---------|-----------------|------------------|
| **h4d** (Samagra-Setu) | Welfare fraud detection via Vahan & Discom cross-referencing | FastAPI (Python) | Vanilla HTML/JS |
| **kawach-ledger** | Blockchain-based PDS transaction ledger | Express.js (Node) | Vanilla HTML/JS |
| **lifestyle_mismatch** (SATARK-360) | AI-powered lifestyle/asset mismatch detection | FastAPI (Python) | Vite + React |

### Target State

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          SENTINEL OFFICIAL PORTAL                                │
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │                        React Frontend (Port 3002)                           ││
│  │  ┌───────────┬───────────┬───────────────┬──────────────┬────────────────┐ ││
│  │  │ Dashboard │ Contracts │ Welfare Fraud │ PDS Ledger   │ Lifestyle Scan │ ││
│  │  │ (existing)│ (existing)│ (from h4d)    │ (kawach)     │ (SATARK-360)   │ ││
│  │  └───────────┴───────────┴───────────────┴──────────────┴────────────────┘ ││
│  │                              │                                              ││
│  │                    Unified Auth Context                                     ││
│  │                    Shared UI Components                                     ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
│                                      │                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │                    Backend Gateway (FastAPI - Port 8000)                    ││
│  │  ┌─────────────────────────────────────────────────────────────────────┐   ││
│  │  │                      Core Services                                   │   ││
│  │  │  • Authentication (JWT)  • Logging  • Error Handling  • Validation  │   ││
│  │  └─────────────────────────────────────────────────────────────────────┘   ││
│  │                                                                             ││
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐  ││
│  │  │ /api/auth/*  │  │ /api/welfare │  │ /api/ledger  │  │ /api/lifestyle │  ││
│  │  │ /api/official│  │    (h4d)     │  │  (kawach)    │  │   (satark)     │  ││
│  │  │ /api/citizen │  │              │  │              │  │                │  ││
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └────────────────┘  ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
│                                      │                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │                           MongoDB (Shared)                                  ││
│  │  ┌─────────┬─────────┬─────────┬──────────────┬───────────┬─────────────┐  ││
│  │  │ users   │contracts│ vendors │welfare_scans │pds_ledger │lifestyle_   │  ││
│  │  │         │         │         │              │           │scans        │  ││
│  │  └─────────┴─────────┴─────────┴──────────────┴───────────┴─────────────┘  ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Target Architecture

### 1.1 Architecture Decision: Backend Gateway + Modular Services

**Decision**: Use a **Backend Gateway with Shared Core Services** pattern.

**Justification**:
- The existing Sentinel backend (FastAPI) is well-structured with authentication, logging, and database connections
- All three applications have lightweight backends that can be absorbed as modules
- Avoids microservices overhead (no service mesh, no inter-service auth complexity)
- Single deployment, single database connection pool, single auth system

### 1.2 Component Mapping

```
┌──────────────────────────────────────────────────────────────────┐
│                      UNIFIED BACKEND (server.py)                 │
├──────────────────────────────────────────────────────────────────┤
│  CORE LAYER (Existing)                                           │
│  ├── Authentication (JWT + bcrypt)                               │
│  ├── Database (Motor + MongoDB)                                  │
│  ├── File Storage (Supabase)                                     │
│  └── Logging (Python logging)                                    │
├──────────────────────────────────────────────────────────────────┤
│  ROUTE MODULES                                                   │
│  ├── /api/auth/*        → Existing                               │
│  ├── /api/citizen/*     → Existing                               │
│  ├── /api/official/*    → Existing                               │
│  ├── /api/welfare/*     → NEW (absorbs h4d logic)                │
│  ├── /api/ledger/*      → NEW (absorbs kawach-ledger logic)      │
│  └── /api/lifestyle/*   → NEW (absorbs lifestyle_mismatch logic) │
├──────────────────────────────────────────────────────────────────┤
│  SERVICE MODULES                                                 │
│  ├── services/welfare_checker.py   (h4d business logic)          │
│  ├── services/ledger_chain.py      (blockchain logic)            │
│  └── services/lifestyle_scanner.py (AI matching logic)           │
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. Backend Integration Plan

### 2.1 Before Structure

```
bitHUnter/
├── backend/                          # Sentinel Core
│   ├── server.py                     # Main FastAPI app
│   ├── fraud_detection.py            # Fraud scoring logic
│   └── seed_data.py                  # Database seeding
├── h4d/
│   └── backend/
│       ├── main.py                   # FastAPI app (separate)
│       └── logic/
│           ├── adapters.py           # Vahan/Discom checkers
│           └── resolver.py           # Identity resolution
├── kawach-ledger/
│   └── server.js                     # Express.js (separate)
└── lifestyle_mismatch/
    ├── professional_scanner.py       # FastAPI app (separate)
    └── *.csv                         # Reference data
```

### 2.2 After Structure

```
bitHUnter/
├── backend/
│   ├── server.py                     # Main gateway (extended)
│   ├── core/
│   │   ├── __init__.py
│   │   ├── auth.py                   # Extracted auth utilities
│   │   ├── database.py               # DB connection management
│   │   └── exceptions.py             # Unified error handling
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py                   # /api/auth/*
│   │   ├── citizen.py                # /api/citizen/*
│   │   ├── official.py               # /api/official/*
│   │   ├── welfare.py                # /api/welfare/* (from h4d)
│   │   ├── ledger.py                 # /api/ledger/* (from kawach)
│   │   └── lifestyle.py              # /api/lifestyle/* (from satark)
│   ├── services/
│   │   ├── __init__.py
│   │   ├── fraud_detection.py        # Existing
│   │   ├── welfare_checker.py        # Absorbed from h4d
│   │   ├── ledger_chain.py           # Absorbed from kawach
│   │   └── lifestyle_scanner.py      # Absorbed from lifestyle_mismatch
│   ├── data/                         # Reference datasets
│   │   ├── welfare_applicants.csv    # From h4d
│   │   ├── vahan_registry.csv        # From h4d
│   │   ├── discom_users.csv          # From h4d
│   │   ├── civil_registry.csv        # From lifestyle_mismatch
│   │   └── discom_data.csv           # From lifestyle_mismatch
│   └── requirements.txt              # Consolidated dependencies
├── h4d/                              # DEPRECATED (keep for reference)
├── kawach-ledger/                    # DEPRECATED (keep for reference)
└── lifestyle_mismatch/               # DEPRECATED (keep for reference)
```

### 2.3 API Route Mapping

| Original App | Original Endpoint | New Portal Endpoint | Auth Required |
|-------------|-------------------|---------------------|---------------|
| h4d | `GET /analyze_applicants` | `GET /api/welfare/analyze` | ✅ Official |
| h4d | `GET /` (frontend) | Discarded | - |
| kawach-ledger | `GET /ledger` | `GET /api/ledger/blocks` | ✅ Official |
| kawach-ledger | `POST /transaction` | `POST /api/ledger/transaction` | ✅ Official |
| kawach-ledger | `GET /verify` | `GET /api/ledger/verify` | ✅ Official |
| kawach-ledger | `GET /stats` | `GET /api/ledger/stats` | ✅ Official |
| kawach-ledger | `POST /tamper` | `POST /api/ledger/simulate-tamper` | ✅ Official |
| kawach-ledger | `POST /reset` | `POST /api/ledger/reset` | ✅ Official |
| lifestyle_mismatch | `POST /scan_applicant_360` | `POST /api/lifestyle/scan` | ✅ Official |

### 2.4 Shared Services Integration

#### Authentication (Single Source of Truth)

All routes will use the existing authentication middleware:

```python
# core/auth.py
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
import jwt

security = HTTPBearer()

async def get_current_user(credentials = Depends(security)) -> dict:
    """Unified auth - applies to ALL protected routes"""
    # ... existing implementation
    return user

async def require_official(user: dict = Depends(get_current_user)) -> dict:
    """Additional check for official-only endpoints"""
    if user.get("role") != "official":
        raise HTTPException(status_code=403, detail="Officials only")
    return user
```

#### Error Handling (Unified)

```python
# core/exceptions.py
from fastapi import HTTPException
from fastapi.responses import JSONResponse

class PortalException(Exception):
    def __init__(self, code: str, message: str, status: int = 400):
        self.code = code
        self.message = message
        self.status = status

# Standard error responses across all modules:
# - VALIDATION_ERROR (400)
# - UNAUTHORIZED (401)
# - FORBIDDEN (403)
# - NOT_FOUND (404)
# - INTERNAL_ERROR (500)
```

#### Logging (Unified)

```python
# core/logging.py
import logging
from functools import wraps

logger = logging.getLogger("sentinel")

def log_request(module: str):
    """Decorator for consistent request logging"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            logger.info(f"[{module}] {func.__name__} called")
            result = await func(*args, **kwargs)
            logger.info(f"[{module}] {func.__name__} completed")
            return result
        return wrapper
    return decorator
```

### 2.5 Database Schema Alignment

#### New Collections Required

```javascript
// MongoDB Collections (additions)

// welfare_scans - Stores h4d analysis results
{
  "id": "uuid",
  "scanned_by": "user_id",        // Links to users collection
  "applicant_id": "string",
  "applicant_name": "string",
  "declared_income": "number",
  "risk_status": "red|yellow|green",
  "flags": [],
  "scanned_at": "ISO timestamp"
}

// pds_ledger - Stores blockchain transactions
{
  "index": "number",
  "timestamp": "ISO timestamp",
  "transaction": {
    "shop_id": "string",
    "dealer_id": "string",
    "beneficiary_id": "string",
    "item": "string",
    "quantity": "number"
  },
  "previous_hash": "string",
  "hash": "string",
  "added_by": "user_id"           // Links to users collection
}

// lifestyle_scans - Stores SATARK-360 results
{
  "id": "uuid",
  "scanned_by": "user_id",
  "applicant_name": "string",
  "applicant_dob": "date",
  "applicant_address": "string",
  "integrity_status": "CLEAN|REVIEW REQUIRED|CRITICAL FRAUD",
  "risk_score": "number",
  "family_cluster": [],
  "assets_detected": [],
  "scanned_at": "ISO timestamp"
}
```

#### Schema Migration Strategy

**No breaking changes required.** New collections will be added alongside existing ones.

```python
# seed_data.py additions
async def init_pds_genesis_block():
    """Create genesis block for PDS ledger if not exists"""
    if await db.pds_ledger.count_documents({}) == 0:
        genesis = {
            "index": 0,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "transaction": {
                "shop_id": "GENESIS",
                "dealer_id": "GENESIS",
                "beneficiary_id": "GENESIS",
                "item": "Genesis Block",
                "quantity": 0
            },
            "previous_hash": "0" * 64,
            "hash": "",  # Calculated
            "added_by": "SYSTEM"
        }
        genesis["hash"] = hash_block(genesis)
        await db.pds_ledger.insert_one(genesis)
```

---

## 3. Frontend Integration Plan

### 3.1 Before Structure

```
bitHUnter/frontend/src/
├── App.js
├── contexts/
│   └── AuthContext.js
├── components/
│   ├── ProtectedRoute.js
│   └── ui/                   # shadcn/ui components
└── pages/
    ├── LandingPage.js
    ├── CitizenPortal.js
    ├── OfficialDashboard.js
    ├── ContractsList.js
    ├── ContractDetail.js
    ├── VendorsList.js
    └── VendorDetail.js
```

### 3.2 After Structure

```
bitHUnter/frontend/src/
├── App.js                           # Extended with new routes
├── contexts/
│   └── AuthContext.js               # Unchanged
├── components/
│   ├── ProtectedRoute.js
│   ├── ui/                          # Unchanged - reused by all modules
│   └── layouts/
│       ├── OfficialLayout.js        # NEW: Shared official nav/sidebar
│       └── CitizenLayout.js         # NEW: Shared citizen layout
├── pages/
│   ├── LandingPage.js
│   ├── CitizenPortal.js
│   ├── OfficialDashboard.js         # Updated with new module cards
│   ├── ContractsList.js
│   ├── ContractDetail.js
│   ├── VendorsList.js
│   ├── VendorDetail.js
│   └── modules/                     # NEW: Integrated module pages
│       ├── welfare/
│       │   ├── WelfareDashboard.js  # Main welfare fraud view
│       │   ├── WelfareScan.js       # Scan individual applicants
│       │   └── WelfareResults.js    # Scan results display
│       ├── ledger/
│       │   ├── LedgerDashboard.js   # Blockchain overview
│       │   ├── LedgerTransaction.js # Add transaction form
│       │   └── LedgerVerify.js      # Verification/tamper demo
│       └── lifestyle/
│           ├── LifestyleDashboard.js
│           └── LifestyleScan.js     # 360 scan form + results
└── services/
    ├── api.js                       # Existing
    ├── welfareApi.js                # NEW
    ├── ledgerApi.js                 # NEW
    └── lifestyleApi.js              # NEW
```

### 3.3 Routing Structure

```javascript
// App.js - Updated routes

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/citizen" element={<CitizenPortal />} />
          <Route path="/citizen/projects/:id" element={<ProjectDetail />} />
          
          {/* Official Auth */}
          <Route path="/official/login" element={<OfficialLogin />} />
          
          {/* Official Portal (Protected) */}
          <Route path="/official" element={<ProtectedRoute><OfficialLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<OfficialDashboard />} />
            <Route path="contracts" element={<ContractsList />} />
            <Route path="contracts/:id" element={<ContractDetail />} />
            <Route path="vendors" element={<VendorsList />} />
            <Route path="vendors/:id" element={<VendorDetail />} />
            
            {/* NEW: Welfare Fraud Module (from h4d) */}
            <Route path="welfare" element={<WelfareDashboard />} />
            <Route path="welfare/scan" element={<WelfareScan />} />
            <Route path="welfare/results/:id" element={<WelfareResults />} />
            
            {/* NEW: PDS Ledger Module (from kawach-ledger) */}
            <Route path="ledger" element={<LedgerDashboard />} />
            <Route path="ledger/transaction" element={<LedgerTransaction />} />
            <Route path="ledger/verify" element={<LedgerVerify />} />
            
            {/* NEW: Lifestyle Scan Module (from lifestyle_mismatch) */}
            <Route path="lifestyle" element={<LifestyleDashboard />} />
            <Route path="lifestyle/scan" element={<LifestyleScan />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

### 3.4 Shared Navigation

```javascript
// components/layouts/OfficialLayout.js

const SIDEBAR_ITEMS = [
  { 
    section: "Overview",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/official/dashboard" }
    ]
  },
  { 
    section: "Contract Intelligence",
    items: [
      { icon: FileText, label: "Contracts", path: "/official/contracts" },
      { icon: Building2, label: "Vendors", path: "/official/vendors" }
    ]
  },
  { 
    section: "Fraud Detection", // NEW SECTION
    items: [
      { icon: UserSearch, label: "Welfare Fraud", path: "/official/welfare" },
      { icon: Link2, label: "PDS Ledger", path: "/official/ledger" },
      { icon: ScanLine, label: "Lifestyle Scan", path: "/official/lifestyle" }
    ]
  }
];
```

### 3.5 UI Component Reuse

**All new module pages will use existing shadcn/ui components:**

| Original App Component | Portal Equivalent |
|----------------------|-------------------|
| h4d form inputs | `<Input />`, `<Label />` from ui/ |
| h4d result cards | `<Card />`, `<Badge />` from ui/ |
| kawach-ledger table | `<Table />` from ui/ |
| kawach-ledger buttons | `<Button />` from ui/ |
| kawach-ledger status badges | `<Badge variant="..." />` from ui/ |
| lifestyle_mismatch form | `<Input />`, `<Textarea />`, `<Label />` |
| lifestyle_mismatch result card | `<Card />`, `<Badge />`, `<Alert />` |

### 3.6 State Management

**No additional state management library needed.**

- Auth state: `AuthContext` (existing)
- Module state: React hooks (`useState`, `useEffect`) per page
- API calls: Axios with auth headers (existing pattern)

```javascript
// Example: services/welfareApi.js
import axios from 'axios';

const API = process.env.REACT_APP_BACKEND_URL + '/api';

export const welfareApi = {
  analyzeApplicants: () => axios.get(`${API}/welfare/analyze`),
  scanApplicant: (data) => axios.post(`${API}/welfare/scan`, data),
  getScanHistory: () => axios.get(`${API}/welfare/history`)
};
```

---

## 4. Authentication & Authorization

### 4.1 Current Auth Model

```
┌─────────────────────────────────────────┐
│           Existing Auth Flow            │
├─────────────────────────────────────────┤
│ 1. User logs in via /official/login     │
│ 2. JWT token stored in localStorage     │
│ 3. Token sent in Authorization header   │
│ 4. Backend validates on each request    │
│ 5. User role: "official" or "citizen"   │
└─────────────────────────────────────────┘
```

### 4.2 Integrated Auth Model

The existing model is sufficient. Enhancements:

```python
# Enhanced role model in database
{
  "id": "uuid",
  "email": "string",
  "role": "official",
  "permissions": [      # NEW: Granular permissions
    "contracts:read",
    "contracts:write",
    "welfare:read",     # Access to welfare module
    "welfare:write",
    "ledger:read",      # Access to PDS ledger
    "ledger:write",
    "lifestyle:read",   # Access to lifestyle scanner
    "lifestyle:write"
  ]
}
```

### 4.3 Permission Mapping

| Module | Read Permission | Write Permission | Default for Officials |
|--------|----------------|------------------|----------------------|
| Contracts | `contracts:read` | `contracts:write` | ✅ Both |
| Vendors | `vendors:read` | `vendors:write` | ✅ Both |
| Welfare | `welfare:read` | `welfare:write` | ✅ Both |
| Ledger | `ledger:read` | `ledger:write` | ✅ Both |
| Lifestyle | `lifestyle:read` | `lifestyle:write` | ✅ Both |

For MVP: All officials get all permissions. Fine-grained RBAC can be added later.

### 4.4 Backend Permission Middleware

```python
# core/auth.py

def require_permission(permission: str):
    """Decorator for permission-based access control"""
    async def permission_checker(user: dict = Depends(get_current_user)):
        # MVP: All officials have all permissions
        if user.get("role") == "official":
            return user
        # Future: Check user.permissions list
        raise HTTPException(status_code=403, detail=f"Missing permission: {permission}")
    return permission_checker

# Usage in routes:
@router.post("/welfare/scan")
async def scan_applicant(
    data: ApplicantData,
    user: dict = Depends(require_permission("welfare:write"))
):
    ...
```

---

## 5. Execution Order

### Phase 1: Backend Consolidation (Week 1-2)

```
┌─────────────────────────────────────────────────────────────────┐
│ Step 1.1: Create backend module structure                       │
│ ├── Create backend/core/ directory                              │
│ ├── Create backend/routes/ directory                            │
│ ├── Create backend/services/ directory                          │
│ └── Move existing code to new structure                         │
├─────────────────────────────────────────────────────────────────┤
│ Step 1.2: Integrate h4d (Welfare) logic                         │
│ ├── Copy h4d/backend/logic/* → backend/services/welfare/        │
│ ├── Copy h4d/data/* → backend/data/                             │
│ ├── Create backend/routes/welfare.py                            │
│ └── Add routes to server.py                                     │
├─────────────────────────────────────────────────────────────────┤
│ Step 1.3: Integrate kawach-ledger logic                         │
│ ├── Translate server.js → backend/services/ledger_chain.py      │
│ ├── Create backend/routes/ledger.py                             │
│ ├── Add MongoDB persistence for blockchain                      │
│ └── Add routes to server.py                                     │
├─────────────────────────────────────────────────────────────────┤
│ Step 1.4: Integrate lifestyle_mismatch logic                    │
│ ├── Copy professional_scanner.py → backend/services/lifestyle/  │
│ ├── Copy *.csv → backend/data/                                  │
│ ├── Create backend/routes/lifestyle.py                          │
│ └── Add routes to server.py                                     │
├─────────────────────────────────────────────────────────────────┤
│ Step 1.5: Consolidate dependencies                              │
│ ├── Merge requirements.txt from all apps                        │
│ ├── Add: splink, duckdb (for lifestyle AI matching)             │
│ └── Test all endpoints via curl/Postman                         │
└─────────────────────────────────────────────────────────────────┘
```

### Phase 2: Frontend Integration (Week 2-3)

```
┌─────────────────────────────────────────────────────────────────┐
│ Step 2.1: Create shared layout components                       │
│ ├── Create OfficialLayout.js with sidebar                       │
│ ├── Update App.js with nested routes                            │
│ └── Test navigation                                             │
├─────────────────────────────────────────────────────────────────┤
│ Step 2.2: Build Welfare Module UI                               │
│ ├── Create pages/modules/welfare/WelfareDashboard.js            │
│ ├── Create pages/modules/welfare/WelfareScan.js                 │
│ ├── Create services/welfareApi.js                               │
│ └── Wire up to backend                                          │
├─────────────────────────────────────────────────────────────────┤
│ Step 2.3: Build Ledger Module UI                                │
│ ├── Create pages/modules/ledger/LedgerDashboard.js              │
│ ├── Create pages/modules/ledger/LedgerTransaction.js            │
│ ├── Create pages/modules/ledger/LedgerVerify.js                 │
│ ├── Create services/ledgerApi.js                                │
│ └── Wire up to backend                                          │
├─────────────────────────────────────────────────────────────────┤
│ Step 2.4: Build Lifestyle Module UI                             │
│ ├── Create pages/modules/lifestyle/LifestyleDashboard.js        │
│ ├── Create pages/modules/lifestyle/LifestyleScan.js             │
│ ├── Create services/lifestyleApi.js                             │
│ └── Wire up to backend                                          │
├─────────────────────────────────────────────────────────────────┤
│ Step 2.5: Update Dashboard                                      │
│ ├── Add module summary cards to OfficialDashboard.js            │
│ ├── Add quick action links                                      │
│ └── Add aggregated stats from all modules                       │
└─────────────────────────────────────────────────────────────────┘
```

### Phase 3: Testing & Cleanup (Week 3-4)

```
┌─────────────────────────────────────────────────────────────────┐
│ Step 3.1: End-to-end testing                                    │
│ ├── Test auth flow for all module routes                        │
│ ├── Test API contracts                                          │
│ └── Test error handling                                         │
├─────────────────────────────────────────────────────────────────┤
│ Step 3.2: Deprecate old apps                                    │
│ ├── Add DEPRECATED.md to h4d/, kawach-ledger/, lifestyle/       │
│ ├── Remove from package.json scripts                            │
│ └── Update README.md                                            │
├─────────────────────────────────────────────────────────────────┤
│ Step 3.3: Documentation                                         │
│ ├── Update API documentation                                    │
│ ├── Update deployment guide                                     │
│ └── Create module developer guide                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Risks & Pitfalls

### 6.1 Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Splink/DuckDB dependency conflicts** | Medium | High | Test in isolated venv first; pin versions |
| **Blockchain state loss on restart** | High | Medium | Persist to MongoDB (already planned) |
| **CSV data path issues** | Medium | Low | Use absolute paths via `BASE_DIR` pattern |
| **CORS issues with new routes** | Low | Low | Already configured with `*` origins |
| **bcrypt version conflicts** | Low | Medium | Already solved with fallback pattern |

### 6.2 Integration Anti-Patterns to Avoid

```
❌ DON'T: Create separate FastAPI apps and proxy between them
✅ DO: Single FastAPI app with modular routers

❌ DON'T: Keep original app frontends and iframe them
✅ DO: Rebuild UIs using existing portal components

❌ DON'T: Create separate databases per module
✅ DO: Use single MongoDB with separate collections

❌ DON'T: Duplicate auth logic in each module
✅ DO: Use centralized auth middleware

❌ DON'T: Copy-paste entire original codebases
✅ DO: Extract only business logic, discard UI/infra code

❌ DON'T: Keep original apps running alongside portal
✅ DO: Fully deprecate after integration complete
```

### 6.3 Long-term Technical Debt Prevention

1. **Enforce consistent patterns**: Create module templates for routes/services
2. **Centralize configuration**: All module settings in `.env`
3. **Maintain clear boundaries**: Each module in its own directory
4. **Document decisions**: Update this plan as implementation proceeds
5. **Code review gate**: All module code must use shared utilities

---

## 7. Consolidated Requirements

### 7.1 Python Dependencies (requirements.txt)

```txt
# Existing
fastapi>=0.100.0
uvicorn>=0.22.0
motor>=3.0.0
pydantic>=2.0.0
python-dotenv>=1.0.0
passlib[bcrypt]>=1.7.4
bcrypt>=4.0.0
python-jose[cryptography]>=3.3.0
python-multipart>=0.0.6
supabase>=1.0.0

# NEW: From h4d
pandas>=2.0.0

# NEW: From lifestyle_mismatch
splink>=3.9.0
duckdb>=0.9.0
```

### 7.2 NPM Dependencies (no changes needed)

The existing frontend already has all required UI components.

---

## 8. Success Criteria

| Criteria | Measurement |
|----------|-------------|
| ✅ Single login grants access to all modules | Test with demo user |
| ✅ All module APIs behind `/api/` prefix | Check route structure |
| ✅ No duplicate business logic | Code review |
| ✅ Original app UIs fully replaced | Visual inspection |
| ✅ All data persisted to shared MongoDB | Database inspection |
| ✅ Consistent error responses | API testing |
| ✅ No original apps running | Process inspection |

---

## Appendix A: Quick Reference Commands

```bash
# Start integrated backend
cd backend && source venv/bin/activate
python -m uvicorn server:app --host 0.0.0.0 --port 8000 --reload

# Start frontend
cd frontend && npm start

# Test new endpoints
curl http://localhost:8000/api/welfare/analyze
curl http://localhost:8000/api/ledger/blocks
curl -X POST http://localhost:8000/api/lifestyle/scan \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Test User","dob":"1980-01-01","address":"Delhi"}'
```

---

## Appendix B: File Migration Checklist

| Source | Destination | Status |
|--------|-------------|--------|
| `h4d/backend/logic/adapters.py` | `backend/services/welfare/adapters.py` | ⬜ |
| `h4d/backend/logic/resolver.py` | `backend/services/welfare/resolver.py` | ⬜ |
| `h4d/data/*.csv` | `backend/data/` | ⬜ |
| `kawach-ledger/server.js` (logic only) | `backend/services/ledger_chain.py` | ⬜ |
| `lifestyle_mismatch/professional_scanner.py` | `backend/services/lifestyle/scanner.py` | ⬜ |
| `lifestyle_mismatch/*.csv` | `backend/data/` | ⬜ |

---

**Document Version**: 1.0  
**Last Updated**: January 12, 2026  
**Author**: Integration Architect
