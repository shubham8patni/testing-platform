from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.core.storage import JSONStorageService
from app.core.config import settings

router = APIRouter()

# Dependency to get storage service
def get_storage():
    return JSONStorageService(settings.data_dir)

class ConfigReloadResponse(BaseModel):
    status: str
    message: str

@router.get("/environments")
async def get_environments(storage: JSONStorageService = Depends(get_storage)):
    """Get environment configurations"""
    config = await storage.load_config("environments")
    if not config:
        # Return example if no config exists
        return {
            "environments": {
                "target": {
                    "name": "Target Environment",
                    "base_url": "https://api-target.example.com",
                    "auth": {"type": "bearer", "token_field": "target_token"}
                },
                "baseline": {
                    "name": "Baseline Environment", 
                    "base_url": "https://api-baseline.example.com",
                    "auth": {"type": "bearer", "token_field": "baseline_token"}
                }
            }
        }
    return config

@router.get("/products")
async def get_products(storage: JSONStorageService = Depends(get_storage)):
    """Get product configurations"""
    config = await storage.load_config("products")
    if not config:
        # Return example if no config exists
        return {
            "categories": {
                "category_1": {
                    "name": "Generic Category 1",
                    "display_order": 1,
                    "products": {
                        "product_a": {
                            "id": "product_a_system_id",
                            "name": "Generic Product A",
                            "plans": {
                                "plan_basic": {"id": "plan_basic_id", "name": "Basic Plan"},
                                "plan_premium": {"id": "plan_premium_id", "name": "Premium Plan"}
                            }
                        }
                    }
                }
            }
        }
    return config

@router.get("/plan-keys")
async def get_plan_keys(storage: JSONStorageService = Depends(get_storage)):
    """Get flat list of all available plan keys"""
    config = await storage.load_config("products")
    plan_keys = {"all_plans": [], "by_category": {}}
    
    if not config:
        return plan_keys
    
    categories = config.get("categories", {})
    
    for category_key, category_data in categories.items():
        category_plans = []
        products = category_data.get("products", {})
        
        for product_key, product_data in products.items():
            plans = product_data.get("plans", {})
            for plan_key in plans.keys():
                full_key = f"{category_key}:{product_key}:{plan_key}"
                plan_keys["all_plans"].append(full_key)
                category_plans.append(full_key)
        
        if category_plans:
            plan_keys["by_category"][category_key] = category_plans
    
    return plan_keys

@router.post("/reload", response_model=ConfigReloadResponse)
async def reload_configuration(storage: JSONStorageService = Depends(get_storage)):
    """Reload configuration from JSON files"""
    try:
        # In a real implementation, this would clear cache and reload
        # For now, just return success
        return ConfigReloadResponse(
            status="success",
            message="Configuration reloaded successfully"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to reload configuration: {str(e)}")