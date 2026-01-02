# API Reference

This document provides comprehensive documentation for all API endpoints in the Insurance Testing Platform.

## 🏗️ Base URL

```
http://localhost:8000/api/v1
```

## 📋 Endpoint Overview

### Users Management
- `POST /users` - Create new user
- `GET /users/{user_id}` - Get user information

### Configuration
- `GET /environments` - Get environment configurations
- `GET /products` - Get product configurations  
- `GET /plan-keys` - Get flat list of available plans
- `POST /reload` - Reload configuration files

### Test Execution
- `POST /tests/start` - Start new test execution
- `GET /tests/{test_id}/status` - Get test status for polling

### Results
- `GET /results/{test_id}` - Get complete test results
- `GET /results/user/{user_id}` - Get user's test history
- `DELETE /results/{test_id}` - Delete test result

### AI Analysis
- `POST /ai/analyze-differences` - Analyze API response differences
- `GET /ai/usage-stats` - Get AI usage statistics

## 📝 Detailed Endpoints

### Users

#### Create User
```http
POST /api/v1/users
Content-Type: application/json

{
  "name": "John Doe"
}
```

**Response:**
```json
{
  "user_id": "john_doe",
  "name": "John Doe",
  "created_at": "2025-01-01T10:00:00Z",
  "message": "User created successfully"
}
```

#### Get User
```http
GET /api/v1/users/john_doe
```

**Response:**
```json
{
  "user_id": "john_doe",
  "name": "John Doe",
  "created_at": "2025-01-01T10:00:00Z",
  "last_login": "2025-01-01T10:30:00Z"
}
```

### Configuration

#### Get Environments
```http
GET /api/v1/config/environments
```

**Response:**
```json
{
  "environments": {
    "dev": {
      "name": "Development Environment",
      "base_url": "https://api-dev.example.com",
      "auth": {
        "type": "bearer",
        "token_field": "dev_token"
      }
    },
    "stage": {
      "name": "Staging Environment",
      "base_url": "https://api-stage.example.com",
      "auth": {
        "type": "bearer",
        "token_field": "stage_token"
      }
    }
  }
}
```

#### Get Products
```http
GET /api/v1/config/products
```

**Response:**
```json
{
  "categories": {
    "car": {
      "name": "Car Insurance",
      "products": {
        "product_key": {
          "id": "system_product_id",
          "name": "Product Name",
          "plans": {
            "plan_key": {
              "id": "system_plan_id",
              "name": "Plan Name",
              "test_sequence": ["application", "payment", "policy"]
            }
          }
        }
      }
    }
  }
}
```

#### Get Plan Keys
```http
GET /api/v1/config/plan-keys
```

**Response:**
```json
{
  "all_plans": [
    "car:product_key:plan_key",
    "car:product_key:another_plan",
    "travel:international:single_trip"
  ],
  "by_category": {
    "car": [
      "car:product_key:plan_key",
      "car:product_key:another_plan"
    ],
    "travel": [
      "travel:international:single_trip"
    ]
  }
}
```

#### Reload Configuration
```http
POST /api/v1/config/reload
```

**Response:**
```json
{
  "status": "success",
  "message": "Configuration reloaded successfully"
}
```

### Test Execution

#### Start Test
```http
POST /api/v1/tests/start
Content-Type: application/json

{
  "user_id": "john_doe",
  "target_env": "dev",
  "baseline_env": "stage",
  "scope": {
    "type": "all",
    "value": ""
  },
  "admin_token": "your_admin_token",
  "customer_token": "your_customer_token",
  "ai_prompt": "Focus on pricing differences and tax variations"
}
```

**Scope Types:**
- `"all"` - Test all available plans
- `"category"` - Test plans in specific category
- `"product"` - Test plans for specific product
- `"plan"` - Test specific plan

**Response:**
```json
{
  "test_id": "test_20250101_001",
  "message": "Test started successfully with ID: test_20250101_001"
}
```

#### Get Test Status
```http
GET /api/v1/tests/test_20250101_001/status
```

**Response:**
```json
{
  "test_id": "test_20250101_001",
  "status": "running",
  "progress": 65,
  "current_step": "Processing car:product_key:plan_key",
  "started_at": "2025-01-01T10:00:00Z",
  "plans": {
    "car:product_key:plan_key": {
      "status": "completed",
      "progress": 100,
      "api_calls": [...]
    },
    "travel:international:single_trip": {
      "status": "running",
      "progress": 45,
      "current_step": "Payment processing"
    }
  },
  "target_env": "dev",
  "baseline_env": "stage"
}
```

### Results

#### Get Test Result
```http
GET /api/v1/results/test_20250101_001
```

**Response:**
```json
{
  "test_id": "test_20250101_001",
  "test_metadata": {
    "status": "completed",
    "started_at": "2025-01-01T10:00:00Z",
    "completed_at": "2025-01-01T10:15:00Z",
    "scope": {
      "type": "all",
      "value": ""
    },
    "environments": {
      "target": "dev",
      "baseline": "stage"
    },
    "ai_prompt": "Focus on pricing differences"
  },
  "execution_summary": {
    "total_plans": 8,
    "completed_plans": 8,
    "failed_plans": 0,
    "total_api_calls": 48,
    "execution_time_minutes": 15
  },
  "plan_results": {
    "car:product_key:plan_key": {
      "status": "completed",
      "api_calls": [...],
      "environment_comparison": {
        "status": "match",
        "differences": [],
        "target_summary": {...},
        "baseline_summary": {...}
      }
    }
  }
}
```

#### Get User Tests
```http
GET /api/v1/results/user/john_doe
```

**Response:**
```json
{
  "user_id": "john_doe",
  "tests": [...],
  "total_tests": 5
}
```

#### Delete Test Result
```http
DELETE /api/v1/results/test_20250101_001
```

**Response:**
```json
{
  "message": "Test test_20250101_001 deleted successfully"
}
```

### AI Analysis

#### Analyze Differences
```http
POST /api/v1/ai/analyze-differences
Content-Type: application/json

{
  "expected": {...},
  "actual": {...},
  "custom_prompt": "Focus on business impact"
}
```

**Response:**
```json
{
  "differences": [
    {
      "field": "premium",
      "type": "value_mismatch",
      "expected": 1000,
      "actual": 1050,
      "severity": "warning"
    }
  ],
  "summary": "Found 1 differences. Premium differs by 50 (5%) between environments.",
  "recommendations": [
    "Review pricing calculation logic",
    "Verify tax configuration differences"
  ],
  "model_used": "cloud",
  "confidence": "high"
}
```

#### Get AI Usage Stats
```http
GET /api/v1/ai/usage-stats
```

**Response:**
```json
{
  "requests_today": 12,
  "daily_limit": 50,
  "cloud_requests_remaining": 38,
  "cloud_enabled": true,
  "model_preference": "cloud"
}
```

## 🔒 Authentication

### Token Management

The platform uses bearer tokens for API authentication:

1. **Admin Portal Token**: For administrative API access
2. **Customer Portal Token**: For customer-facing API access

### Token Storage

- Tokens are stored in test configuration
- Used for API calls to insurance environments
- Never logged or exposed in responses
- Encrypted when stored locally

## 🚨 Error Codes

- `400` - Bad Request (invalid input data)
- `401` - Unauthorized (invalid token)
- `404` - Not Found (resource doesn't exist)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## 🔄 Status Codes

### Test Status
- `"pending"` - Test initialized but not started
- `"running"` - Test currently executing
- `"completed"` - Test finished successfully
- `"failed"` - Test terminated due to errors

### AI Model Types
- `"cloud"` - Hugging Face cloud API
- `"local"` - Local model fallback
- `"basic_comparison"` - Rule-based comparison

## 📊 Response Formats

All API responses follow consistent JSON structure:

```json
{
  "data": {...},
  "message": "Success message",
  "status": "success|error",
  "timestamp": "2025-01-01T10:00:00Z"
}
```

## 🧪 Testing

### Health Check
```bash
curl http://localhost:8000/health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "insurance-testing-platform"
}
```

### API Documentation
Interactive API documentation available at:
```
http://localhost:8000/docs
```