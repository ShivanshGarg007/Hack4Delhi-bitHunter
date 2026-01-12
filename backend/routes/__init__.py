# Route modules for Sentinel Portal
# Each module provides an APIRouter that gets mounted in server.py

from .welfare import router as welfare_router
from .ledger import router as ledger_router
from .lifestyle import router as lifestyle_router

__all__ = [
    "welfare_router",
    "ledger_router", 
    "lifestyle_router"
]
