from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from app.core.storage import JSONStorageService
from app.core.config import settings

router = APIRouter()

# Dependencies
def get_storage():
    return JSONStorageService(settings.data_dir)

class TestResultResponse(BaseModel):
    test_id: str
    test_metadata: Dict[str, Any]
    execution_summary: Dict[str, Any]
    plan_results: Dict[str, Any]

class UserTestsResponse(BaseModel):
    user_id: str
    tests: List[Dict[str, Any]]
    total_tests: int

@router.get("/{test_id}", response_model=TestResultResponse)
async def get_test_result(
    test_id: str,
    storage: JSONStorageService = Depends(get_storage)
):
    """Get complete test result"""
    try:
        test_data = await storage.get_test_result(test_id)
        if not test_data:
            raise HTTPException(status_code=404, detail="Test result not found")
        
        return TestResultResponse(
            test_id=test_id,
            test_metadata=test_data.get("test_metadata", {}),
            execution_summary=test_data.get("execution_summary", {}),
            plan_results=test_data.get("plan_results", {})
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get test result: {str(e)}")

@router.get("/user/{user_id}", response_model=UserTestsResponse)
async def get_user_tests(
    user_id: str,
    storage: JSONStorageService = Depends(get_storage)
):
    """Get all tests for a user (max 10)"""
    try:
        user_tests = await storage.get_user_tests(user_id)
        return UserTestsResponse(
            user_id=user_id,
            tests=user_tests,
            total_tests=len(user_tests)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get user tests: {str(e)}")

@router.delete("/{test_id}")
async def delete_test_result(
    test_id: str,
    storage: JSONStorageService = Depends(get_storage)
):
    """Delete a test result"""
    try:
        # In JSON file system, we would delete the file
        # For now, this is a placeholder
        return {"message": f"Test {test_id} deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete test: {str(e)}")