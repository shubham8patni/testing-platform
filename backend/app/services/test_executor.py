import asyncio
import random
from typing import Dict, Any, List
from datetime import datetime
from app.core.storage import JSONStorageService
from app.core.config import settings

class TestExecutorService:
    def __init__(self, storage_service: JSONStorageService):
        self.storage = storage_service
        self.running_tests = {}
    
    async def start_test(self, test_config: Dict[str, Any]) -> str:
        """Start a new test execution"""
        test_id = f"test_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Initialize test progress
        plans_to_test = self._get_plans_to_test(test_config['scope'])
        
        test_progress = {
            "test_id": test_id,
            "status": "running",
            "progress": 0,
            "current_step": "initializing",
            "started_at": datetime.now().isoformat(),
            "plans": {}
        }
        
        # Initialize plan progress
        for plan_key in plans_to_test:
            test_progress["plans"][plan_key] = {
                "status": "pending",
                "progress": 0,
                "current_step": None,
                "api_calls": [],
                "error": None
            }
        
        self.running_tests[test_id] = test_progress
        
        # Save initial test data
        test_data = {
            "test_metadata": {
                "test_id": test_id,
                "user_id": test_config["user_id"],
                "started_at": datetime.now().isoformat(),
                "status": "running",
                "scope": test_config["scope"],
                "environments": {
                    "target": test_config["target_env"],
                    "baseline": test_config["baseline_env"]
                },
                "ai_prompt": test_config.get("ai_prompt", "")
            },
            "execution_summary": {
                "total_plans": len(plans_to_test),
                "completed_plans": 0,
                "failed_plans": 0,
                "total_api_calls": 0,
                "execution_time_minutes": 0
            },
            "plan_results": {}
        }
        
        await self.storage.save_test_result(test_id, test_data)
        
        # Start async execution
        asyncio.create_task(self._execute_test(test_id, test_config))
        
        return test_id
    
    async def get_test_status(self, test_id: str) -> Dict[str, Any]:
        """Get current test status"""
        if test_id in self.running_tests:
            return self.running_tests[test_id]
        
        # If not in memory, load from storage
        test_data = await self.storage.get_test_result(test_id)
        if test_data:
            return {
                "test_id": test_id,
                "status": test_data["test_metadata"]["status"],
                "progress": self._calculate_progress(test_data),
                "current_step": test_data["test_metadata"].get("current_step"),
                "started_at": test_data["test_metadata"]["started_at"],
                "plans": test_data.get("plan_results", {})
            }
        
        return {"error": "Test not found"}
    
    async def _execute_test(self, test_id: str, config: Dict[str, Any]):
        """Execute test across all plans"""
        plans_to_test = self._get_plans_to_test(config['scope'])
        total_plans = len(plans_to_test)
        
        for i, plan_key in enumerate(plans_to_test):
            try:
                # Update current step
                self.running_tests[test_id]["current_step"] = f"Testing {plan_key}"
                self.running_tests[test_id]["progress"] = int((i / total_plans) * 100)
                
                # Execute plan
                await self._test_plan(test_id, plan_key, config)
                
                # Update progress
                self.running_tests[test_id]["plans"][plan_key]["status"] = "completed"
                self.running_tests[test_id]["plans"][plan_key]["progress"] = 100
                
            except Exception as e:
                self.running_tests[test_id]["plans"][plan_key]["status"] = "failed"
                self.running_tests[test_id]["plans"][plan_key]["error"] = str(e)
        
        # Finalize test
        self.running_tests[test_id]["status"] = "completed"
        self.running_tests[test_id]["progress"] = 100
        self.running_tests[test_id]["current_step"] = "Test completed"
        
        # Save final results
        await self._save_final_results(test_id, config)
    
    async def _test_plan(self, test_id: str, plan_key: str, config: Dict[str, Any]):
        """Test a single plan"""
        # Simulate API calls for demonstration
        # In real implementation, this would make actual API calls
        
        self.running_tests[test_id]["plans"][plan_key]["status"] = "running"
        self.running_tests[test_id]["plans"][plan_key]["progress"] = 0
        
        # Simulate test sequence
        test_sequence = ["application", "payment", "policy", "verification"]
        
        for i, step in enumerate(test_sequence):
            # Update step progress
            step_progress = int((i + 1) / len(test_sequence) * 100)
            self.running_tests[test_id]["plans"][plan_key]["progress"] = step_progress
            self.running_tests[test_id]["plans"][plan_key]["current_step"] = f"Processing {step}"
            
            # Simulate API call with random response time
            await asyncio.sleep(random.uniform(0.5, 2.0))
            
            # Generate mock API call result
            api_call = {
                "endpoint": f"/{step}",
                "method": "POST" if step in ["application", "payment"] else "GET",
                "status_code": 200,
                "response_time_ms": int(random.uniform(100, 500)),
                "response": {
                    "status": "success",
                    "data": f"Mock {step} response for {plan_key}",
                    "timestamp": datetime.now().isoformat()
                }
            }
            
            self.running_tests[test_id]["plans"][plan_key]["api_calls"].append(api_call)
    
    async def _save_final_results(self, test_id: str, config: Dict[str, Any]):
        """Save final test results to storage"""
        current_data = await self.storage.get_test_result(test_id)
        if not current_data:
            return
        
        # Update with running test data
        current_data["test_metadata"]["status"] = "completed"
        current_data["test_metadata"]["completed_at"] = datetime.now().isoformat()
        current_data["test_metadata"]["current_step"] = "Test completed"
        
        # Convert running test data to plan results
        running_test = self.running_tests.get(test_id, {})
        for plan_key, plan_data in running_test.get("plans", {}).items():
            current_data["plan_results"][plan_key] = {
                "status": plan_data["status"],
                "api_calls": plan_data.get("api_calls", []),
                "error": plan_data.get("error"),
                "environment_comparison": self._mock_environment_comparison(plan_key)
            }
        
        # Update execution summary
        total_plans = len(current_data["plan_results"])
        completed_plans = sum(1 for p in current_data["plan_results"].values() if p["status"] == "completed")
        failed_plans = sum(1 for p in current_data["plan_results"].values() if p["status"] == "failed")
        total_api_calls = sum(len(p["api_calls"]) for p in current_data["plan_results"].values())
        
        current_data["execution_summary"] = {
            "total_plans": total_plans,
            "completed_plans": completed_plans,
            "failed_plans": failed_plans,
            "total_api_calls": total_api_calls,
            "execution_time_minutes": 5  # Mock value
        }
        
        await self.storage.save_test_result(test_id, current_data)
        
        # Clean up from memory
        if test_id in self.running_tests:
            del self.running_tests[test_id]
    
    def _get_plans_to_test(self, scope: Dict[str, Any]) -> List[str]:
        """Get list of plans to test based on scope"""
        scope_type = scope.get("type", "all")
        
        # Mock data - in real implementation, this would come from config
        all_plans = [
            "car:zurich_autocillin_mv4:tlo",
            "car:zurich_autocillin_mv4:comprehensive",
            "car:oona_mv4:basic",
            "car:oona_mv4:premium",
            "travel:international:single_trip",
            "travel:international:annual",
            "health:family:hmo",
            "health:family:ppo"
        ]
        
        if scope_type == "all":
            return all_plans
        elif scope_type == "category":
            category = scope.get("value", "")
            return [p for p in all_plans if p.startswith(f"{category}:")]
        elif scope_type == "product":
            product = scope.get("value", "")
            return [p for p in all_plans if f":{product}:" in p]
        elif scope_type == "plan":
            return [scope.get("value", "")]
        
        return []
    
    def _calculate_progress(self, test_data: Dict[str, Any]) -> int:
        """Calculate overall test progress"""
        plan_results = test_data.get("plan_results", {})
        if not plan_results:
            return 0
        
        total_plans = len(plan_results)
        completed_plans = sum(1 for p in plan_results.values() if p.get("status") == "completed")
        
        return int((completed_plans / total_plans) * 100) if total_plans > 0 else 0
    
    def _mock_environment_comparison(self, plan_key: str) -> Dict[str, Any]:
        """Generate mock environment comparison"""
        return {
            "status": "match" if random.random() > 0.3 else "diff",
            "differences": [],
            "target_summary": {
                "api_calls": random.randint(3, 6),
                "total_response_time": random.randint(500, 2000)
            },
            "baseline_summary": {
                "api_calls": random.randint(3, 6),
                "total_response_time": random.randint(500, 2000)
            }
        }