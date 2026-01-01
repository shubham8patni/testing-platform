from fastapi import APIRouter
from app.api.v1.endpoints import users, config

api_router = APIRouter()

api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(config.router, prefix="/config", tags=["config"])