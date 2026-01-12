"""
Database Connection Manager for Sentinel Portal
Provides centralized access to MongoDB.
"""

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from typing import Optional
import os

# Singleton database connection
_client: Optional[AsyncIOMotorClient] = None
_db: Optional[AsyncIOMotorDatabase] = None


def init_database() -> AsyncIOMotorDatabase:
    """
    Initialize database connection.
    Called once at application startup.
    """
    global _client, _db
    
    mongo_url = os.environ.get('MONGO_URL')
    db_name = os.environ.get('DB_NAME')
    
    if not mongo_url or not db_name:
        raise ValueError("MONGO_URL and DB_NAME environment variables required")
    
    _client = AsyncIOMotorClient(mongo_url)
    _db = _client[db_name]
    
    return _db


def get_database() -> AsyncIOMotorDatabase:
    """
    Get the database instance.
    Must be called after init_database().
    """
    global _db
    
    if _db is None:
        # Auto-initialize if not yet done
        return init_database()
    
    return _db


def close_database():
    """
    Close database connection.
    Called at application shutdown.
    """
    global _client, _db
    
    if _client:
        _client.close()
        _client = None
        _db = None


# Collection helpers for type hints
def get_users_collection():
    return get_database().users


def get_contracts_collection():
    return get_database().contracts


def get_vendors_collection():
    return get_database().vendors


def get_citizen_reports_collection():
    return get_database().citizen_reports


def get_audit_actions_collection():
    return get_database().audit_actions


# New collections for integrated modules
def get_welfare_scans_collection():
    """Welfare fraud scan results (from h4d)"""
    return get_database().welfare_scans


def get_pds_ledger_collection():
    """PDS blockchain transactions (from kawach-ledger)"""
    return get_database().pds_ledger


def get_lifestyle_scans_collection():
    """Lifestyle/asset mismatch scan results (from lifestyle_mismatch)"""
    return get_database().lifestyle_scans
