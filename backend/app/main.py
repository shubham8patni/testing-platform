try:
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    from app.api.v1.api import api_router
except ImportError as e:
    print(f"Missing dependency: {e}")
    print("Please run: pip install fastapi uvicorn pydantic pydantic-settings aiofiles requests")
    exit(1)

app = FastAPI(
    title="Insurance Testing Platform",
    description="Template platform for insurance policy purchase testing across environments",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Insurance Testing Platform API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "insurance-testing-platform"}