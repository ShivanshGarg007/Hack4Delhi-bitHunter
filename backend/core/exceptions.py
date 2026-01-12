"""
Unified Exception Handling for Sentinel Portal
Provides consistent error responses across all modules.
"""

from fastapi import Request
from fastapi.responses import JSONResponse
from typing import Optional
import logging

logger = logging.getLogger("sentinel.exceptions")


class PortalException(Exception):
    """
    Base exception for all portal errors.
    Use this for consistent error responses.
    
    Example:
        raise PortalException(
            code="WELFARE_SCAN_FAILED",
            message="Failed to scan applicant",
            status=500,
            details={"applicant_id": "123"}
        )
    """
    
    def __init__(
        self, 
        code: str,
        message: str,
        status: int = 400,
        details: Optional[dict] = None
    ):
        self.code = code
        self.message = message
        self.status = status
        self.details = details or {}
        super().__init__(self.message)
    
    def to_dict(self) -> dict:
        return {
            "error": {
                "code": self.code,
                "message": self.message,
                "details": self.details
            }
        }


# Pre-defined error types for consistency
class ValidationError(PortalException):
    """Invalid input data"""
    def __init__(self, message: str, details: Optional[dict] = None):
        super().__init__("VALIDATION_ERROR", message, 400, details)


class NotFoundError(PortalException):
    """Resource not found"""
    def __init__(self, resource: str, identifier: str):
        super().__init__(
            "NOT_FOUND", 
            f"{resource} not found: {identifier}", 
            404,
            {"resource": resource, "identifier": identifier}
        )


class UnauthorizedError(PortalException):
    """Authentication required"""
    def __init__(self, message: str = "Authentication required"):
        super().__init__("UNAUTHORIZED", message, 401)


class ForbiddenError(PortalException):
    """Permission denied"""
    def __init__(self, message: str = "Permission denied"):
        super().__init__("FORBIDDEN", message, 403)


class InternalError(PortalException):
    """Internal server error"""
    def __init__(self, message: str = "Internal server error"):
        super().__init__("INTERNAL_ERROR", message, 500)


class ServiceUnavailableError(PortalException):
    """External service unavailable"""
    def __init__(self, service: str):
        super().__init__(
            "SERVICE_UNAVAILABLE",
            f"Service unavailable: {service}",
            503,
            {"service": service}
        )


async def handle_portal_exception(request: Request, exc: PortalException) -> JSONResponse:
    """
    Exception handler for PortalException.
    Register this with FastAPI app.
    
    Example:
        app.add_exception_handler(PortalException, handle_portal_exception)
    """
    logger.error(
        f"PortalException: {exc.code} - {exc.message}",
        extra={"details": exc.details, "path": request.url.path}
    )
    
    return JSONResponse(
        status_code=exc.status,
        content=exc.to_dict()
    )


async def handle_generic_exception(request: Request, exc: Exception) -> JSONResponse:
    """
    Catch-all exception handler.
    Prevents leaking internal error details to clients.
    """
    logger.exception(f"Unhandled exception at {request.url.path}")
    
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "INTERNAL_ERROR",
                "message": "An unexpected error occurred",
                "details": {}
            }
        }
    )
