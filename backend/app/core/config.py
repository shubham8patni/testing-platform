from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    project_name: str = "Insurance Testing Platform"
    api_v1_str: str = "/api/v1"
    data_dir: str = "./data"
    max_tests_per_user: int = 10
    
    # Hugging Face AI (optional)
    huggingface_token: str = ""
    
    class Config:
        env_file = ".env"

settings = Settings()