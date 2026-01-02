import json
from typing import Dict, Any, Optional
import requests
from huggingface_hub import InferenceClient
from app.core.config import settings

class AIServiceWithFallback:
    def __init__(self, hf_token: Optional[str] = None):
        self.hf_client = InferenceClient(token=hf_token) if hf_token else None
        self.use_cloud = hf_token is not None
        self.request_count = 0
        self.daily_limit = 50  # Conservative daily limit for free tier
        
    async def analyze_differences(
        self, 
        expected: Dict[str, Any], 
        actual: Dict[str, Any],
        custom_prompt: str = ""
    ) -> Dict[str, Any]:
        """Analyze differences between expected and actual API responses"""
        
        if self.use_cloud and self.request_count < self.daily_limit:
            try:
                return await self._analyze_with_cloud(expected, actual, custom_prompt)
            except Exception as e:
                print(f"Cloud API failed: {e}, using local analysis")
                return await self._analyze_locally(expected, actual, custom_prompt)
        else:
            return await self._analyze_locally(expected, actual, custom_prompt)
    
    async def _analyze_with_cloud(
        self, 
        expected: Dict[str, Any], 
        actual: Dict[str, Any],
        custom_prompt: str
    ) -> Dict[str, Any]:
        """Use Hugging Face cloud API for analysis"""
        if not self.hf_client:
            raise Exception("Hugging Face client not initialized")
        
        analysis_prompt = self._build_comparison_prompt(expected, actual, custom_prompt)
        
        try:
            response = self.hf_client.text_generation(
                analysis_prompt,
                model="Qwen/Qwen2.5-3B-Instruct",
                max_new_tokens=500,
                temperature=0.1
            )
            
            self.request_count += 1
            return self._parse_response(response, "cloud")
        except Exception as e:
            raise Exception(f"Cloud API error: {str(e)}")
    
    async def _analyze_locally(
        self, 
        expected: Dict[str, Any], 
        actual: Dict[str, Any],
        custom_prompt: str
    ) -> Dict[str, Any]:
        """Use local rule-based analysis as fallback"""
        differences = []
        
        # Field-by-field comparison
        all_keys = set(expected.keys()) | set(actual.keys())
        
        for key in all_keys:
            if key not in expected:
                differences.append({
                    "field": key,
                    "type": "extra_field",
                    "value": actual[key],
                    "severity": "warning"
                })
            elif key not in actual:
                differences.append({
                    "field": key,
                    "type": "missing_field", 
                    "expected": expected[key],
                    "severity": "critical"
                })
            elif expected[key] != actual[key]:
                differences.append({
                    "field": key,
                    "type": "value_mismatch",
                    "expected": expected[key],
                    "actual": actual[key],
                    "severity": self._determine_severity(key, expected[key], actual[key])
                })
        
        # Business logic analysis
        business_analysis = self._analyze_business_logic(expected, actual, custom_prompt)
        
        return {
            "differences": differences,
            "summary": f"Found {len(differences)} differences. {business_analysis}",
            "model_used": "local_rule_based",
            "confidence": "medium"
        }
    
    def _build_comparison_prompt(
        self, 
        expected: Dict[str, Any], 
        actual: Dict[str, Any],
        custom_prompt: str
    ) -> str:
        """Build comparison prompt for AI analysis"""
        prompt = f"""
        Analyze these two API responses for insurance policy purchase testing:
        
        Expected Response: {json.dumps(expected, indent=2)}
        Actual Response: {json.dumps(actual, indent=2)}
        
        Custom Analysis Focus: {custom_prompt}
        
        Provide analysis in JSON format:
        {{
            "differences": [
                {{
                    "field": "field_name",
                    "type": "missing_field|extra_field|value_mismatch|type_mismatch",
                    "expected": "expected_value",
                    "actual": "actual_value", 
                    "severity": "critical|warning|info"
                }}
            ],
            "summary": "brief summary of key differences and their business impact",
            "recommendations": ["list of recommended actions if needed"]
        }}
        
        Focus on business logic differences that could affect insurance policy issuance.
        """
        return prompt
    
    def _parse_response(self, response: str, source: str) -> Dict[str, Any]:
        """Parse AI response and ensure it's valid JSON"""
        try:
            # Extract JSON from response
            json_start = response.find('{')
            json_end = response.rfind('}') + 1
            if json_start != -1 and json_end > json_start:
                json_content = response[json_start:json_end]
                parsed = json.loads(json_content)
                parsed["model_used"] = source
                return parsed
        except Exception as e:
            print(f"Failed to parse AI response: {e}")
        
        return {
            "differences": [],
            "summary": f"Failed to parse {source} analysis response",
            "model_used": source,
            "confidence": "low"
        }
    
    def _determine_severity(self, key: str, expected: Any, actual: Any) -> str:
        """Determine severity of difference based on field importance"""
        key_lower = key.lower()
        
        # Critical fields for insurance
        critical_fields = [
            'policy_id', 'status', 'premium', 'coverage_amount', 
            'coverage_sum_insured', 'deductible', 'policy_number'
        ]
        
        # Important fields
        important_fields = [
            'applicant_name', 'start_date', 'end_date', 'payment_status',
            'payment_amount', 'issue_date', 'insured_name'
        ]
        
        if any(field in key_lower for field in critical_fields):
            return 'critical'
        elif any(field in key_lower for field in important_fields):
            return 'warning'
        else:
            return 'info'
    
    def _analyze_business_logic(
        self, 
        expected: Dict[str, Any], 
        actual: Dict[str, Any],
        custom_prompt: str
    ) -> str:
        """Analyze business logic differences"""
        insights = []
        
        # Check for pricing differences
        if 'premium' in expected and 'premium' in actual:
            exp_prem = expected['premium']
            act_prem = actual['premium']
            if isinstance(exp_prem, (int, float)) and isinstance(act_prem, (int, float)):
                diff = abs(exp_prem - act_prem)
                if diff > 0:
                    insights.append(f"Premium differs by {diff} ({diff/exp_prem*100:.1f}%)")
        
        # Check for coverage differences
        exp_coverage = expected.get('coverage_sum_insured', 0)
        act_coverage = actual.get('coverage_sum_insured', 0)
        if exp_coverage != act_coverage:
            insights.append(f"Coverage amount differs: {exp_coverage} vs {act_coverage}")
        
        # Check status differences
        exp_status = expected.get('status', '')
        act_status = actual.get('status', '')
        if exp_status != act_status:
            insights.append(f"Policy status differs: {exp_status} vs {act_status}")
        
        return "; ".join(insights) if insights else "No significant business logic differences detected"