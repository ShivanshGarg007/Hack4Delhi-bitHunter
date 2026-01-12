"""
Centralized Authentication Module for Sentinel Portal
All protected routes should use these utilities.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
from datetime import datetime, timezone, timedelta
import jwt
import os

# Security setup
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Lazy-loaded config values (read at runtime, not import time)
_jwt_secret = None
_jwt_algorithm = None
TOKEN_EXPIRE_DAYS = 7


def get_jwt_secret() -> str:
    """Get JWT secret, loading from environment on first call."""
    global _jwt_secret
    if _jwt_secret is None:
        _jwt_secret = os.environ.get('JWT_SECRET')
        if not _jwt_secret:
            raise ValueError("JWT_SECRET environment variable is required")
    return _jwt_secret


def get_jwt_algorithm() -> str:
    """Get JWT algorithm, loading from environment on first call."""
    global _jwt_algorithm
    if _jwt_algorithm is None:
        _jwt_algorithm = os.environ.get('JWT_ALGORITHM', 'HS256')
    return _jwt_algorithm


def create_access_token(data: dict) -> str:
    """Create a JWT access token with expiration."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, get_jwt_secret(), algorithm=get_jwt_algorithm())
    return encoded_jwt


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify password with bcrypt fallback for compatibility.
    Handles passlib/bcrypt version conflicts gracefully.
    """
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        import bcrypt
        try:
            return bcrypt.checkpw(
                plain_password.encode('utf-8'), 
                hashed_password.encode('utf-8')
            )
        except Exception:
            return False


def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    return pwd_context.hash(password)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    """
    Validate JWT token and return current user.
    Use as a dependency in protected routes.
    
    Example:
        @router.get("/protected")
        async def protected_route(user: dict = Depends(get_current_user)):
            return {"user": user}
    """
    from .database import get_database
    db = get_database()
    
    token = credentials.credentials
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[get_jwt_algorithm()])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Invalid token: missing user ID"
            )
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="User not found"
            )
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Token expired"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid token"
        )


async def require_official(
    user: dict = Depends(get_current_user)
) -> dict:
    """
    Require the user to have 'official' role.
    Use for official-only endpoints.
    
    Example:
        @router.get("/official-only")
        async def official_route(user: dict = Depends(require_official)):
            return {"user": user}
    """
    if user.get("role") != "official":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This endpoint requires official access"
        )
    return user


def require_permission(permission: str):
    """
    Factory for permission-based access control.
    Returns a dependency that checks for specific permissions.
    
    Example:
        @router.post("/welfare/scan")
        async def scan(user: dict = Depends(require_permission("welfare:write"))):
            ...
    """
    async def permission_checker(user: dict = Depends(get_current_user)) -> dict:
        # MVP: All officials have all permissions
        if user.get("role") == "official":
            return user
        
        # Future: Check user.permissions list
        user_permissions = user.get("permissions", [])
        if permission not in user_permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Missing required permission: {permission}"
            )
        return user
    
    return permission_checker
