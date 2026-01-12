"""
Blockchain Ledger Service
Absorbed from: kawach-ledger

Provides in-memory blockchain operations.
For persistent storage, use routes/ledger.py which uses MongoDB.
"""

import hashlib
import json
from typing import Dict, List, Optional, Any
from datetime import datetime, timezone

from core.logging import get_logger

logger = get_logger("services.ledger")


class Block:
    """Represents a single block in the chain."""
    
    def __init__(
        self,
        index: int,
        transaction: Dict[str, Any],
        previous_hash: str,
        timestamp: Optional[str] = None,
        added_by: Optional[str] = None
    ):
        self.index = index
        self.timestamp = timestamp or datetime.now(timezone.utc).isoformat()
        self.transaction = transaction
        self.previous_hash = previous_hash
        self.added_by = added_by
        self.hash = self.calculate_hash()
    
    def calculate_hash(self) -> str:
        """Calculate SHA-256 hash of block contents."""
        block_data = {
            "index": self.index,
            "timestamp": self.timestamp,
            "transaction": self.transaction,
            "previous_hash": self.previous_hash,
            "added_by": self.added_by
        }
        block_string = json.dumps(block_data, sort_keys=True)
        return hashlib.sha256(block_string.encode()).hexdigest()
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert block to dictionary."""
        return {
            "index": self.index,
            "timestamp": self.timestamp,
            "transaction": self.transaction,
            "previous_hash": self.previous_hash,
            "hash": self.hash,
            "added_by": self.added_by
        }


class LedgerChain:
    """
    In-memory blockchain implementation for PDS transactions.
    
    Note: For production, use MongoDB persistence via routes/ledger.py
    This class is provided for utility operations and testing.
    """
    
    def __init__(self):
        self.chain: List[Block] = []
        self._create_genesis_block()
    
    def _create_genesis_block(self):
        """Create the initial genesis block."""
        genesis_transaction = {
            "shop_id": "GENESIS",
            "dealer_id": "GENESIS",
            "beneficiary_id": "GENESIS",
            "item": "Genesis Block",
            "quantity": 0
        }
        genesis = Block(
            index=0,
            transaction=genesis_transaction,
            previous_hash="0" * 64,
            added_by="SYSTEM"
        )
        self.chain.append(genesis)
        logger.info("Genesis block created")
    
    def get_latest_block(self) -> Block:
        """Get the most recent block in the chain."""
        return self.chain[-1]
    
    def add_transaction(
        self,
        shop_id: str,
        dealer_id: str,
        beneficiary_id: str,
        item: str,
        quantity: float,
        added_by: Optional[str] = None
    ) -> Block:
        """
        Add a new transaction to the blockchain.
        
        Args:
            shop_id: PDS shop identifier
            dealer_id: Dealer identifier
            beneficiary_id: Beneficiary identifier
            item: Item being distributed (Rice, Wheat, etc.)
            quantity: Quantity in kg
            added_by: User ID who added the transaction
        
        Returns:
            The newly created block
        """
        previous_block = self.get_latest_block()
        
        transaction = {
            "shop_id": shop_id,
            "dealer_id": dealer_id,
            "beneficiary_id": beneficiary_id,
            "item": item,
            "quantity": quantity
        }
        
        new_block = Block(
            index=len(self.chain),
            transaction=transaction,
            previous_hash=previous_block.hash,
            added_by=added_by
        )
        
        self.chain.append(new_block)
        logger.info(f"Block #{new_block.index} added - {item} ({quantity}kg)")
        
        return new_block
    
    def verify_chain(self) -> Dict[str, Any]:
        """
        Verify the integrity of the entire blockchain.
        
        Returns:
            Dict with verification status and details
        """
        for i in range(1, len(self.chain)):
            current = self.chain[i]
            previous = self.chain[i - 1]
            
            # Check if previous hash reference is correct
            if current.previous_hash != previous.hash:
                return {
                    "is_valid": False,
                    "status": "COMPROMISED",
                    "message": f"Previous hash mismatch at block #{i}",
                    "tampered_block": i
                }
            
            # Verify current block's hash
            if current.hash != current.calculate_hash():
                return {
                    "is_valid": False,
                    "status": "COMPROMISED",
                    "message": f"Hash verification failed at block #{i}",
                    "tampered_block": i
                }
        
        return {
            "is_valid": True,
            "status": "SAFE",
            "message": "Blockchain integrity verified",
            "total_blocks": len(self.chain)
        }
    
    def get_ledger(self) -> List[Dict[str, Any]]:
        """Get all blocks as dictionaries."""
        return [block.to_dict() for block in self.chain]
    
    def get_stats(self) -> Dict[str, Any]:
        """Get ledger statistics."""
        # Count items (excluding genesis)
        items: Dict[str, Dict[str, float]] = {}
        unique_shops = set()
        unique_beneficiaries = set()
        
        for block in self.chain[1:]:  # Skip genesis
            tx = block.transaction
            item = tx.get("item", "Unknown")
            quantity = tx.get("quantity", 0)
            
            if item not in items:
                items[item] = {"total_quantity": 0, "transaction_count": 0}
            
            items[item]["total_quantity"] += quantity
            items[item]["transaction_count"] += 1
            
            unique_shops.add(tx.get("shop_id", ""))
            unique_beneficiaries.add(tx.get("beneficiary_id", ""))
        
        return {
            "total_blocks": len(self.chain),
            "total_transactions": len(self.chain) - 1,
            "unique_shops": len(unique_shops),
            "unique_beneficiaries": len(unique_beneficiaries),
            "items": [
                {"item": k, **v} for k, v in items.items()
            ]
        }
    
    def simulate_tamper(self, block_index: Optional[int] = None) -> Dict[str, Any]:
        """
        Simulate tampering for demonstration.
        
        Args:
            block_index: Specific block to tamper (random if not specified)
        
        Returns:
            Info about the tampered block
        """
        import random
        
        if len(self.chain) < 2:
            return {"success": False, "message": "No blocks to tamper"}
        
        if block_index is None:
            block_index = random.randint(1, len(self.chain) - 1)
        
        if block_index < 1 or block_index >= len(self.chain):
            return {"success": False, "message": "Invalid block index"}
        
        # Modify the transaction
        original_quantity = self.chain[block_index].transaction.get("quantity", 0)
        self.chain[block_index].transaction["quantity"] = original_quantity + 100
        
        logger.warning(f"DEMO: Tampered block #{block_index}")
        
        return {
            "success": True,
            "message": f"Block #{block_index} has been tampered",
            "tampered_block": block_index
        }
    
    def reset(self):
        """Reset blockchain to genesis state."""
        self.chain = []
        self._create_genesis_block()
        logger.info("Ledger reset to genesis state")
