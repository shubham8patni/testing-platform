from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any
from app.core.storage import JSONStorageService
from app.services.test_executor import TestExecutorService
from app.core.config import settings

router = APIRouter()

# Dependencies
def get_storage():
    return JSONStorageService(settings.data_dir)

def get_test_executor(storage: JSONStorageService = Depends(get_storage)):
    return TestExecutorService(storage)

class TestStartRequest(BaseModel):
    user_id: str
    target_env: str
    baseline_env: str
    scope: Dict[str, Any]
    admin_token: str
    customer_token: str
    ai_prompt: str

class TestStartResponse(BaseModel):
    test_id: str
    message: str

class TestStatusResponse(BaseModel):
    test_id: str
    status: str
    progress: int
    current_step: str | None = None
    started_at: str
    plans: Dict[str, Any]
    target_env: str
    baseline_env: str

@router.post("/start", response_model=TestStartResponse)
async def start_test(
    test_request: TestStartRequest,
    executor: TestExecutorService = Depends(get_test_executor)
):
    """Start a new test execution"""
    # Validate request
    if not test_request.user_id:
        raise HTTPException(status_code=400, detail="User ID is required")
    
    if test_request.target_env == test_request.baseline_env:
        raise HTTPException(status_code=400, detail="Target and baseline environments must be different")
    
    try:
        test_id = await executor.start_test(test_request.dict())
        return TestStartResponse(
            test_id=test_id,
            message=f"Test started successfully with ID: {test_id}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start test: {str(e)}")

@router.get("/{test_id}/status", response_model=TestStatusResponse)
async def get_test_status(
    test_id: str,
    executor: TestExecutorService = Depends(get_test_executor)
):
    """Get current test status for polling"""
    try:
        status_data = await executor.get_test_status(test_id)
        
        if "error" in status_data:
            raise HTTPException(status_code=404, detail=status_data["error"])
        
        return TestStatusResponse(**status_data)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get test status: {str(e)}")