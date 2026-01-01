import json
import os
import aiofiles
from typing import Dict, Any, Optional, List
from datetime import datetime
from pathlib import Path

class JSONStorageService:
    def __init__(self, data_dir: str = "./data"):
        self.data_dir = Path(data_dir)
        self._ensure_directories()
    
    def _ensure_directories(self):
        """Create necessary directories if they don't exist"""
        directories = [
            "users",
            "configs", 
            "tests",
            "cache"
        ]
        
        for directory in directories:
            (self.data_dir / directory).mkdir(parents=True, exist_ok=True)
    
    async def save_user(self, user_id: str, user_data: Dict[str, Any]) -> bool:
        """Save user data to JSON file"""
        try:
            file_path = self.data_dir / "users" / user_id / "config.json"
            file_path.parent.mkdir(parents=True, exist_ok=True)
            
            async with aiofiles.open(file_path, 'w') as f:
                await f.write(json.dumps(user_data, indent=2, default=str))
            return True
        except Exception as e:
            print(f"Error saving user {user_id}: {e}")
            return False
    
    async def get_user(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user data from JSON file"""
        try:
            file_path = self.data_dir / "users" / user_id / "config.json"
            if file_path.exists():
                async with aiofiles.open(file_path, 'r') as f:
                    content = await f.read()
                    return json.loads(content)
        except Exception as e:
            print(f"Error loading user {user_id}: {e}")
        return None
    
    async def save_config(self, config_name: str, config_data: Dict[str, Any]) -> bool:
        """Save configuration data"""
        try:
            file_path = self.data_dir / "configs" / f"{config_name}.json"
            async with aiofiles.open(file_path, 'w') as f:
                await f.write(json.dumps(config_data, indent=2, default=str))
            return True
        except Exception as e:
            print(f"Error saving config {config_name}: {e}")
            return False
    
    async def load_config(self, config_name: str) -> Dict[str, Any]:
        """Load configuration data"""
        try:
            file_path = self.data_dir / "configs" / f"{config_name}.json"
            if file_path.exists():
                async with aiofiles.open(file_path, 'r') as f:
                    content = await f.read()
                    return json.loads(content)
        except Exception as e:
            print(f"Error loading config {config_name}: {e}")
        return {}
    
    async def save_test_result(self, test_id: str, test_data: Dict[str, Any]) -> bool:
        """Save test result data"""
        try:
            file_path = self.data_dir / "tests" / f"{test_id}.json"
            async with aiofiles.open(file_path, 'w') as f:
                await f.write(json.dumps(test_data, indent=2, default=str))
            return True
        except Exception as e:
            print(f"Error saving test result {test_id}: {e}")
            return False
    
    async def get_test_result(self, test_id: str) -> Optional[Dict[str, Any]]:
        """Get test result data"""
        try:
            file_path = self.data_dir / "tests" / f"{test_id}.json"
            if file_path.exists():
                async with aiofiles.open(file_path, 'r') as f:
                    content = await f.read()
                    return json.loads(content)
        except Exception as e:
            print(f"Error loading test result {test_id}: {e}")
        return None
    
    async def get_user_tests(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all tests for a user"""
        try:
            tests_dir = self.data_dir / "tests"
            user_tests = []
            
            if tests_dir.exists():
                for test_file in tests_dir.glob("*.json"):
                    test_data = await self.get_test_result(test_file.stem)
                    if test_data and test_data.get("test_metadata", {}).get("user_id") == user_id:
                        user_tests.append(test_data)
            
            # Sort by creation time, newest first
            user_tests.sort(key=lambda x: x.get("test_metadata", {}).get("started_at", ""), reverse=True)
            return user_tests[:10]  # Limit to 10 tests per user
        except Exception as e:
            print(f"Error getting tests for user {user_id}: {e}")
            return []