"""
Lifestyle Mismatch Detection Routes
Integrated from: lifestyle_mismatch (SATARK-360)

Endpoints:
- POST /api/lifestyle/scan      - 360° profile scan
- GET  /api/lifestyle/history   - Get scan history
- GET  /api/lifestyle/stats     - Get scan statistics
"""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timezone
import uuid

from core.auth import require_official, require_permission
from core.database import get_database, get_lifestyle_scans_collection
from core.logging import get_logger, log_request
from core.exceptions import ValidationError

from services.lifestyle import LifestyleScanner

router = APIRouter(prefix="/api/lifestyle", tags=["Lifestyle Mismatch Detection"])
logger = get_logger("lifestyle")


# Request/Response Models
class ApplicantProfile(BaseModel):
    name: str
    dob: str  # ISO date string
    address: str


class ScanResultResponse(BaseModel):
    integrity_status: str  # "CLEAN", "REVIEW REQUIRED", "CRITICAL FRAUD"
    risk_score: int
    family_cluster: List[str]
    assets_detected: List[str]
    system_message: str
    scanned_at: Optional[str] = None


@router.post("/scan", response_model=ScanResultResponse)
@log_request("lifestyle")
async def scan_applicant_360(
    applicant: ApplicantProfile,
    user: dict = Depends(require_permission("lifestyle:write"))
):
    """
    Perform a 360° profile scan on an applicant.
    
    Checks:
    - Identity resolution via AI matching
    - Family cluster identification
    - Asset detection (vehicles, high electricity bills)
    - Risk scoring
    
    Originally: POST /scan_applicant_360 in lifestyle_mismatch
    """
    scanner = LifestyleScanner()
    result = await scanner.scan(applicant.name, applicant.dob, applicant.address)
    
    # Save to database
    db = get_database()
    scan_doc = {
        "id": str(uuid.uuid4()),
        "scanned_by": user["id"],
        "scanned_by_name": user["full_name"],
        "applicant_name": applicant.name,
        "applicant_dob": applicant.dob,
        "applicant_address": applicant.address,
        "integrity_status": result["integrity_status"],
        "risk_score": result["risk_score"],
        "family_cluster": result["family_cluster"],
        "assets_detected": result.get("assets_detected", []),
        "system_message": result["system_message"],
        "scanned_at": datetime.now(timezone.utc).isoformat()
    }
    await db.lifestyle_scans.insert_one(scan_doc)
    
    return ScanResultResponse(
        integrity_status=result["integrity_status"],
        risk_score=result["risk_score"],
        family_cluster=result["family_cluster"],
        assets_detected=result.get("assets_detected", []),
        system_message=result["system_message"],
        scanned_at=scan_doc["scanned_at"]
    )


@router.get("/history")
@log_request("lifestyle")
async def get_scan_history(
    skip: int = 0,
    limit: int = 50,
    status: Optional[str] = None,
    user: dict = Depends(require_permission("lifestyle:read"))
):
    """
    Get history of lifestyle scans.
    Filterable by integrity status.
    """
    db = get_database()
    
    query = {}
    if status:
        query["integrity_status"] = status
    
    scans = await db.lifestyle_scans.find(
        query, {"_id": 0}
    ).sort("scanned_at", -1).skip(skip).limit(limit).to_list(limit)
    
    total = await db.lifestyle_scans.count_documents(query)
    
    return {
        "scans": scans,
        "total": total,
        "skip": skip,
        "limit": limit
    }


@router.get("/stats")
@log_request("lifestyle")
async def get_lifestyle_stats(
    user: dict = Depends(require_permission("lifestyle:read"))
):
    """
    Get aggregated lifestyle scan statistics.
    """
    db = get_database()
    
    total_scans = await db.lifestyle_scans.count_documents({})
    critical_fraud = await db.lifestyle_scans.count_documents({"integrity_status": "CRITICAL FRAUD"})
    review_required = await db.lifestyle_scans.count_documents({"integrity_status": "REVIEW REQUIRED"})
    clean = await db.lifestyle_scans.count_documents({"integrity_status": "CLEAN"})
    
    # Average risk score
    pipeline = [
        {"$group": {"_id": None, "avg_risk": {"$avg": "$risk_score"}}}
    ]
    avg_result = await db.lifestyle_scans.aggregate(pipeline).to_list(1)
    avg_risk = avg_result[0]["avg_risk"] if avg_result else 0
    
    # Recent scans
    recent_scans = await db.lifestyle_scans.find(
        {}, {"_id": 0}
    ).sort("scanned_at", -1).limit(5).to_list(5)
    
    return {
        "total_scans": total_scans,
        "status_distribution": {
            "critical_fraud": critical_fraud,
            "review_required": review_required,
            "clean": clean
        },
        "fraud_detection_rate": round(critical_fraud / total_scans * 100, 2) if total_scans > 0 else 0,
        "average_risk_score": round(avg_risk, 2),
        "recent_scans": recent_scans
    }


@router.get("/scan/{scan_id}")
@log_request("lifestyle")
async def get_scan_detail(
    scan_id: str,
    user: dict = Depends(require_permission("lifestyle:read"))
):
    """
    Get details of a specific scan.
    """
    db = get_database()
    
    scan = await db.lifestyle_scans.find_one({"id": scan_id}, {"_id": 0})
    
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    
    return scan
