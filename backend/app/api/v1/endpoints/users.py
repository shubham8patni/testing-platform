from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any
from datetime import datetime
from app.core.storage import JSONStorageService
from app.core.config import settings

router = APIRouter()

# Dependency to get storage service
def get_storage():
    return JSONStorageService(settings.data_dir)

class UserCreate(BaseModel):
    name: str

class UserResponse(BaseModel):
    user_id: str
    name: str
    created_at: str
    message: str

@router.post("/", response_model=UserResponse)
async def create_user(user: UserCreate, storage: JSONStorageService = Depends(get_storage)):
    """Create a new user"""
    if not user.name or not user.name.strip():
        raise HTTPException(status_code=400, detail="Name is required")
    
    # Generate user_id from name (simple approach for demo)
    user_id = user.name.lower().replace(" ", "_")
    
    # Check if user already exists
    existing_user = await storage.get_user(user_id)
    if existing_user:
        return UserResponse(
            user_id=user_id,
            name=user.name,
            created_at=existing_user.get("created_at", ""),
            message="User already exists"
        )
    
    # Create new user
    user_data = {
        "user_id": user_id,
        "name": user.name,
        "created_at": datetime.now().isoformat(),
        "last_login": datetime.now().isoformat()
    }
    
    success = await storage.save_user(user_id, user_data)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to create user")
    
    return UserResponse(
        user_id=user_id,
        name=user.name,
        created_at=user_data["created_at"],
        message="User created successfully"
    )

@router.get("/{user_id}")
async def get_user(user_id: str, storage: JSONStorageService = Depends(get_storage)):
    """Get user information"""
    user_data = await storage.get_user(user_id)
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user_data