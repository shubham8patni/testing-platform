from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any
from app.services.ai_service import AIServiceWithFallback
from app.core.config import settings

router = APIRouter()

# Dependencies
def get_ai_service():
    return AIServiceWithFallback(settings.huggingface_token)

class AIAnalysisRequest(BaseModel):
    expected: Dict[str, Any]
    actual: Dict[str, Any]
    custom_prompt: str = ""

class AIAnalysisResponse(BaseModel):
    differences: list
    summary: str
    recommendations: list
    model_used: str
    confidence: str

@router.post("/analyze-differences", response_model=AIAnalysisResponse)
async def analyze_api_differences(
    request: AIAnalysisRequest,
    ai_service: AIServiceWithFallback = Depends(get_ai_service)
):
    """Analyze differences between API responses using AI"""
    try:
        analysis = await ai_service.analyze_differences(
            request.expected, 
            request.actual, 
            request.custom_prompt
        )
        return AIAnalysisResponse(**analysis)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")

@router.get("/usage-stats")
async def get_ai_usage_stats(ai_service: AIServiceWithFallback = Depends(get_ai_service)):
    """Get current AI usage statistics"""
    return {
        "requests_today": ai_service.request_count,
        "daily_limit": ai_service.daily_limit,
        "cloud_requests_remaining": max(0, ai_service.daily_limit - ai_service.request_count),
        "cloud_enabled": ai_service.use_cloud,
        "model_preference": "cloud" if ai_service.use_cloud else "local"
    }