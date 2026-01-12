"""
Unified Logging for Sentinel Portal
Provides consistent logging across all modules.
"""

import logging
from functools import wraps
from typing import Callable, Any
import time

# Configure root logger
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)


def get_logger(module: str) -> logging.Logger:
    """
    Get a logger for a specific module.
    
    Example:
        logger = get_logger("welfare")
        logger.info("Scanning applicant...")
    """
    return logging.getLogger(f"sentinel.{module}")


def log_request(module: str):
    """
    Decorator for logging API requests.
    Logs function entry, exit, and execution time.
    
    Example:
        @router.get("/scan")
        @log_request("welfare")
        async def scan_applicant():
            ...
    """
    logger = get_logger(module)
    
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def async_wrapper(*args, **kwargs) -> Any:
            start_time = time.time()
            logger.info(f"[{func.__name__}] Request started")
            
            try:
                result = await func(*args, **kwargs)
                elapsed = time.time() - start_time
                logger.info(f"[{func.__name__}] Request completed in {elapsed:.3f}s")
                return result
            except Exception as e:
                elapsed = time.time() - start_time
                logger.error(f"[{func.__name__}] Request failed after {elapsed:.3f}s: {e}")
                raise
        
        @wraps(func)
        def sync_wrapper(*args, **kwargs) -> Any:
            start_time = time.time()
            logger.info(f"[{func.__name__}] Request started")
            
            try:
                result = func(*args, **kwargs)
                elapsed = time.time() - start_time
                logger.info(f"[{func.__name__}] Request completed in {elapsed:.3f}s")
                return result
            except Exception as e:
                elapsed = time.time() - start_time
                logger.error(f"[{func.__name__}] Request failed after {elapsed:.3f}s: {e}")
                raise
        
        # Return appropriate wrapper based on function type
        import asyncio
        if asyncio.iscoroutinefunction(func):
            return async_wrapper
        return sync_wrapper
    
    return decorator


class RequestLogger:
    """
    Context manager for logging request lifecycle.
    
    Example:
        async with RequestLogger("welfare", "scan_applicant") as log:
            log.info("Processing...")
            result = do_something()
            log.info(f"Result: {result}")
    """
    
    def __init__(self, module: str, operation: str):
        self.logger = get_logger(module)
        self.operation = operation
        self.start_time = None
    
    async def __aenter__(self):
        self.start_time = time.time()
        self.logger.info(f"[{self.operation}] Started")
        return self.logger
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        elapsed = time.time() - self.start_time
        if exc_type:
            self.logger.error(
                f"[{self.operation}] Failed after {elapsed:.3f}s: {exc_val}"
            )
        else:
            self.logger.info(f"[{self.operation}] Completed in {elapsed:.3f}s")
        return False  # Don't suppress exceptions
