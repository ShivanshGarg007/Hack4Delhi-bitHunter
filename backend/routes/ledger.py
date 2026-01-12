"""
PDS Ledger (Blockchain) Routes  
Integrated from: kawach-ledger

Endpoints:
- GET  /api/ledger/blocks       - Get full blockchain ledger
- POST /api/ledger/transaction  - Add new transaction block
- GET  /api/ledger/verify       - Verify blockchain integrity
- GET  /api/ledger/stats        - Get ledger statistics
- POST /api/ledger/simulate-tamper - Simulate tampering (demo)
- POST /api/ledger/reset        - Reset blockchain (demo)
"""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timezone
import hashlib
import json

from core.auth import require_official, require_permission
from core.database import get_database, get_pds_ledger_collection
from core.logging import get_logger, log_request
from core.exceptions import ValidationError

router = APIRouter(prefix="/api/ledger", tags=["PDS Ledger"])
logger = get_logger("ledger")


# Request/Response Models
class Transaction(BaseModel):
    shop_id: str
    dealer_id: str
    beneficiary_id: str
    item: str
    quantity: float


class Block(BaseModel):
    index: int
    timestamp: str
    transaction: dict
    previous_hash: str
    hash: str
    added_by: Optional[str] = None


class LedgerResponse(BaseModel):
    success: bool
    blocks: List[Block]
    total_blocks: int


class VerifyResponse(BaseModel):
    success: bool
    status: str  # "SAFE" or "COMPROMISED"
    message: str
    total_blocks: int
    tampered_block: Optional[int] = None


def hash_block(block: dict) -> str:
    """Calculate SHA-256 hash of a block."""
    block_copy = {k: v for k, v in block.items() if k != "hash" and k != "_id"}
    block_string = json.dumps(block_copy, sort_keys=True)
    return hashlib.sha256(block_string.encode()).hexdigest()


async def ensure_genesis_block():
    """Create genesis block if chain is empty."""
    db = get_database()
    count = await db.pds_ledger.count_documents({})
    
    if count == 0:
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
            "hash": "",
            "added_by": "SYSTEM"
        }
        genesis["hash"] = hash_block(genesis)
        await db.pds_ledger.insert_one(genesis)
        logger.info("Genesis block created")


@router.get("/blocks", response_model=LedgerResponse)
@log_request("ledger")
async def get_ledger(
    user: dict = Depends(require_permission("ledger:read"))
):
    """
    Get the full blockchain ledger.
    
    Originally: GET /ledger in kawach-ledger
    """
    await ensure_genesis_block()
    
    db = get_database()
    blocks = await db.pds_ledger.find(
        {}, {"_id": 0}
    ).sort("index", 1).to_list(1000)
    
    return LedgerResponse(
        success=True,
        blocks=blocks,
        total_blocks=len(blocks)
    )


@router.post("/transaction")
@log_request("ledger")
async def add_transaction(
    transaction: Transaction,
    user: dict = Depends(require_permission("ledger:write"))
):
    """
    Add a new transaction to the blockchain.
    
    Originally: POST /transaction in kawach-ledger
    """
    await ensure_genesis_block()
    
    db = get_database()
    
    # Get previous block
    previous_block = await db.pds_ledger.find_one(
        {}, sort=[("index", -1)]
    )
    
    if not previous_block:
        raise HTTPException(status_code=500, detail="Blockchain not initialized")
    
    # Create new block
    new_block = {
        "index": previous_block["index"] + 1,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "transaction": {
            "shop_id": transaction.shop_id,
            "dealer_id": transaction.dealer_id,
            "beneficiary_id": transaction.beneficiary_id,
            "item": transaction.item,
            "quantity": transaction.quantity
        },
        "previous_hash": previous_block["hash"],
        "hash": "",
        "added_by": user["id"]
    }
    new_block["hash"] = hash_block(new_block)
    
    # Add to chain
    await db.pds_ledger.insert_one(new_block)
    
    logger.info(f"Block #{new_block['index']} added - {transaction.item} ({transaction.quantity}kg)")
    
    return {
        "success": True,
        "message": "Transaction added successfully",
        "block": {k: v for k, v in new_block.items() if k != "_id"}
    }


@router.get("/verify", response_model=VerifyResponse)
@log_request("ledger")
async def verify_ledger(
    user: dict = Depends(require_permission("ledger:read"))
):
    """
    Verify blockchain integrity by checking all hashes.
    
    Originally: GET /verify in kawach-ledger
    """
    db = get_database()
    blocks = await db.pds_ledger.find({}).sort("index", 1).to_list(1000)
    
    is_valid = True
    tampered_block = None
    
    for i in range(1, len(blocks)):
        current = blocks[i]
        previous = blocks[i - 1]
        
        # Check if previous hash matches
        if current["previous_hash"] != previous["hash"]:
            is_valid = False
            tampered_block = i
            break
        
        # Recalculate and verify hash
        recalculated = hash_block(current)
        if current["hash"] != recalculated:
            is_valid = False
            tampered_block = i
            break
    
    if is_valid:
        return VerifyResponse(
            success=True,
            status="SAFE",
            message="Blockchain is secure - No tampering detected",
            total_blocks=len(blocks)
        )
    else:
        return VerifyResponse(
            success=False,
            status="COMPROMISED",
            message=f"Tampering detected at block #{tampered_block}",
            total_blocks=len(blocks),
            tampered_block=tampered_block
        )


@router.get("/stats")
@log_request("ledger")
async def get_ledger_stats(
    user: dict = Depends(require_permission("ledger:read"))
):
    """
    Get ledger statistics.
    
    Originally: GET /stats in kawach-ledger
    """
    db = get_database()
    
    total_blocks = await db.pds_ledger.count_documents({})
    
    # Aggregate by item
    pipeline = [
        {"$match": {"index": {"$gt": 0}}},  # Exclude genesis
        {"$group": {
            "_id": "$transaction.item",
            "total_quantity": {"$sum": "$transaction.quantity"},
            "transaction_count": {"$sum": 1}
        }},
        {"$sort": {"total_quantity": -1}}
    ]
    item_stats = await db.pds_ledger.aggregate(pipeline).to_list(100)
    
    # Get unique entities
    unique_shops = len(await db.pds_ledger.distinct("transaction.shop_id"))
    unique_beneficiaries = len(await db.pds_ledger.distinct("transaction.beneficiary_id"))
    
    return {
        "success": True,
        "total_blocks": total_blocks,
        "total_transactions": total_blocks - 1,  # Exclude genesis
        "unique_shops": unique_shops - 1,  # Exclude GENESIS
        "unique_beneficiaries": unique_beneficiaries - 1,
        "items": item_stats
    }


@router.post("/simulate-tamper")
@log_request("ledger")
async def simulate_tamper(
    user: dict = Depends(require_permission("ledger:write"))
):
    """
    Simulate tampering for demonstration purposes.
    Modifies a random block to break the chain integrity.
    
    Originally: POST /tamper in kawach-ledger
    """
    db = get_database()
    
    # Get a random non-genesis block
    blocks = await db.pds_ledger.find({"index": {"$gt": 0}}).to_list(100)
    
    if not blocks:
        return {"success": False, "message": "No blocks to tamper with"}
    
    import random
    target = random.choice(blocks)
    
    # Modify the transaction (tamper)
    await db.pds_ledger.update_one(
        {"_id": target["_id"]},
        {"$set": {"transaction.quantity": target["transaction"]["quantity"] + 100}}
    )
    
    logger.warning(f"DEMO: Tampered block #{target['index']}")
    
    return {
        "success": True,
        "message": f"Block #{target['index']} has been tampered with!",
        "tampered_block": target["index"]
    }


@router.post("/reset")
@log_request("ledger")
async def reset_ledger(
    user: dict = Depends(require_permission("ledger:write"))
):
    """
    Reset the blockchain to genesis state.
    FOR DEMO PURPOSES ONLY.
    
    Originally: POST /reset in kawach-ledger
    """
    db = get_database()
    
    # Delete all blocks
    await db.pds_ledger.delete_many({})
    
    # Recreate genesis
    await ensure_genesis_block()
    
    logger.info("Ledger reset to genesis state")
    
    return {
        "success": True,
        "message": "Ledger has been reset to genesis block"
    }
