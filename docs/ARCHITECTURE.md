# Architecture Documentation

## System Overview

The Insurance Testing Platform is designed as a distributed system that validates insurance policy purchase flows across multiple environments. The architecture follows a service-oriented design with clear separation of concerns, enabling scalability, maintainability, and extensibility.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend Layer                           │
│                 React SPA + TypeScript UI                        │
└─────────────────────────┬───────────────────────────────────────┘
                          │ HTTP/WebSocket
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                       API Gateway                               │
│                    FastAPI Application                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│  │   Users     │ │    Tests    │ │  Results    │ │     AI      ││
│  │ Endpoint    │ │  Endpoint   │ │ Endpoint    │ │ Endpoint    ││
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘│
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Business Logic Layer                        │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────┐ │
│  │ Test Executor   │    │ AI Service      │    │ Storage       │ │
│  │ Service         │    │ with Fallback   │    │ Service       │ │
│  └─────────────────┘    └─────────────────┘    └──────────────┘ │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Layer                                 │
│                   JSON File Storage                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│  │    Users    │ │    Tests    │ │  Configs    │ │    Cache    ││
│  │   Data      │ │   Results   │ │   Data      │ │   Storage   ││
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘│
└─────────────────────────┬───────────────────────────────────────┘
                          │ External API Calls
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    External Systems                             │
│  ┌─────────────────┐              ┌─────────────────┐           │
│  │ Target Env      │              │ Baseline Env    │           │
│  │ (DEV/QA APIs)   │              │ (STAGE APIs)    │           │
│  └─────────────────┘              └─────────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### 1. Frontend Layer

**Technology Stack:**
- React 19+ with TypeScript
- React Router for navigation
- Axios for HTTP communication
- CSS-in-JS or Styled Components

**Key Components:**
```
src/
├── components/
│   ├── Welcome.tsx           # User creation/landing
│   ├── UserDashboard.tsx     # Test history management
│   ├── TestConfig.tsx        # Test configuration UI
│   ├── TestProgress.tsx      # Real-time progress tracking
│   ├── ResultsView.tsx        # Results display and analysis
│   └── PlanDetails.tsx       # Detailed plan inspection
├── hooks/
│   ├── useTestProgress.ts    # Real-time progress polling
│   ├── useApi.ts            # API communication hook
│   └── useAuth.ts           # Authentication state
├── services/
│   └── api.ts               # API client configuration
└── types/
    └── index.ts             # TypeScript type definitions
```

### 2. API Gateway Layer (FastAPI)

**Core Design Patterns:**
- **Dependency Injection**: Service dependencies managed through FastAPI's DI system
- **Pydantic Validation**: Request/response validation with automatic documentation
- **Async/Await**: Non-blocking I/O for high concurrency
- **Middleware**: CORS, logging, error handling

**API Structure:**
```
/api/v1/
├── users/                   # User management endpoints
├── config/                  # Configuration management
├── tests/                   # Test execution endpoints
├── results/                 # Test result retrieval
└── ai/                      # AI analysis endpoints
```

### 3. Business Logic Layer

#### Test Executor Service
**Responsibilities:**
- Orchestrate test execution across environments
- Manage test lifecycle and state
- Handle parallel/sequential execution
- Implement retry logic and error recovery
- Track progress and generate reports

**Key Methods:**
```python
class TestExecutorService:
    async def start_test(config: TestConfig) -> str
    async def get_test_status(test_id: str) -> TestStatus
    async def _execute_test(test_id: str, config: TestConfig)
    async def _test_plan(test_id: str, plan_key: str, config: TestConfig)
```

#### AI Service with Fallback
**Architecture:**
- **Primary**: Hugging Face cloud inference (Qwen2.5-3B-Instruct)
- **Secondary**: Local model inference (SmolLM2-1.7B)
- **Fallback**: Rule-based comparison logic

**Analysis Pipeline:**
```
Input Differences → Cloud AI → Local AI → Rule-based → Structured Output
```

#### Storage Service
**Design Principles:**
- **Async I/O**: Non-blocking file operations
- **Directory Organization**: Logical separation of data types
- **Error Handling**: Graceful failure recovery
- **Extensibility**: Interface for future database migration

### 4. Data Layer

**Storage Structure:**
```
data/
├── users/                   # User configurations
│   └── {user_id}/
│       └── config.json
├── configs/                 # System configurations
│   ├── environments.json
│   ├── products.json
│   └── cache.json
├── tests/                   # Test results
│   └── {test_id}.json
└── cache/                   # Temporary cache storage
```

**Data Models:**

#### Test Result Schema
```json
{
  "test_metadata": {
    "test_id": "test_20260102_143022",
    "user_id": "john_doe",
    "started_at": "2026-01-02T14:30:22Z",
    "status": "completed",
    "scope": {"type": "category", "value": "car"},
    "environments": {"target": "qa", "baseline": "stage"},
    "ai_prompt": "Focus on pricing differences"
  },
  "execution_summary": {
    "total_plans": 8,
    "completed_plans": 7,
    "failed_plans": 1,
    "total_api_calls": 56,
    "execution_time_minutes": 12.5
  },
  "plan_results": {
    "car:zurich_autocillin_mv4:tlo": {
      "status": "completed",
      "api_calls": [...],
      "environment_comparison": {...}
    }
  }
}
```

## Data Flow Architecture

### Test Execution Flow

```
1. User Request (Frontend)
   ↓
2. POST /api/v1/tests/start
   ↓
3. TestExecutorService.start_test()
   ↓
4. Create test_id and initialize state
   ↓
5. Async task: _execute_test()
   ├── Load configuration
   ├── For each plan in scope:
   │   ├── Execute on target environment
   │   ├── Execute on baseline environment
   │   ├── Compare results
   │   └── Store intermediate results
   └── Save final results
   ↓
6. Real-time status polling via /api/v1/tests/{id}/status
   ↓
7. Results retrieval via /api/v1/results/{id}
```

### AI Analysis Flow

```
1. Difference Detection
   ├── Field-level comparison
   ├── Business logic validation
   └── Severity classification
   ↓
2. AI Processing Pipeline
   ├── Try Cloud AI (HuggingFace)
   ├── Fallback to Local AI
   └── Final Fallback: Rule-based
   ↓
3. Structured Output
   ├── Differences list
   ├── Business impact summary
   └── Recommendations
```

## Security Architecture

### Authentication & Authorization
```
Frontend Token Storage → API Request → Token Validation → API Call
```

**Token Types:**
- **User Tokens**: Session management
- **Admin Tokens**: Admin portal API access
- **Customer Tokens**: Customer portal API access

### Data Security
- **Token Encryption**: Secure storage in configuration
- **API Key Rotation**: Planned token refresh mechanism
- **Environment Isolation**: Separate configs per environment

## Scalability Architecture

### Current Scalability Limits
```
Single Server Limits:
├── JSON File Storage: ~10K tests before performance degradation
├── Memory Usage: ~100 concurrent tests
├── API Rate Limits: Depends on external systems
└── AI Usage: 50 requests/day (free tier)
```

### Future Scalability Enhancements

#### Database Migration Path
```
JSON Files → PostgreSQL → Distributed Database
```

#### Horizontal Scaling
```
Load Balancer → Multiple API Servers → Shared Database → Message Queue
```

#### Caching Strategy
```
Redis Cache → CDN → Browser Cache → API Response Cache
```

## Performance Architecture

### Current Performance Characteristics
- **API Response Time**: 100-500ms (mock data)
- **Test Execution**: ~2 minutes per plan (mock)
- **AI Analysis**: 1-5 seconds (depends on model)
- **Frontend Load Time**: <2 seconds initial load

### Performance Optimization Strategies

#### Backend Optimizations
- **Async Operations**: All I/O operations non-blocking
- **Connection Pooling**: For external API calls
- **Response Compression**: Gzip for API responses
- **Efficient Serialization**: Pydantic model optimization

#### Frontend Optimizations
- **Code Splitting**: Lazy loading of components
- **Virtual Scrolling**: For large test lists
- **Caching Strategy**: API response caching
- **Optimistic Updates**: Improved perceived performance

## Deployment Architecture

### Development Environment
```
Local Machine:
├── Backend: uvicorn dev server (port 8000)
├── Frontend: React dev server (port 3000)
├── Storage: Local JSON files
└── Mock APIs: Simulated external systems
```

### Production Deployment (Future)
```
Production Infrastructure:
├── Load Balancer (Nginx/HAProxy)
├── Application Servers (Gunicorn + FastAPI)
├── Database Cluster (PostgreSQL)
├── Cache Layer (Redis)
├── File Storage (S3/MinIO)
├── Monitoring (Prometheus + Grafana)
└── Logging (ELK Stack)
```

## Monitoring & Observability

### Current Monitoring
- **Health Checks**: `/health` endpoint
- **API Documentation**: Automatic OpenAPI/Swagger
- **Error Logging**: Console and file logging
- **Test Metrics**: Basic execution statistics

### Future Monitoring Enhancements
```
Observability Stack:
├── Metrics: Prometheus + Custom Business Metrics
├── Logging: Structured JSON logging + ELK Stack
├── Tracing: OpenTelemetry for distributed tracing
├── Alerting: AlertManager for critical failures
└── Dashboards: Grafana for operational visibility
```

## Extensibility Architecture

### Plugin Architecture (Future)
```
Plugin System:
├── Test Plugins: Custom test logic per product
├── AI Plugins: Different AI models and analysis
├── Storage Plugins: Multiple storage backends
└── Notification Plugins: Various alert channels
```

### Configuration Extensibility
- **Dynamic Configuration**: Runtime configuration updates
- **Environment Variables**: Docker-friendly configuration
- **Feature Flags**: Enable/disable features per environment
- **Custom Validation**: Per-product validation rules

## Risk Architecture

### Single Points of Failure
```
Current SPOFs:
├── JSON File System: Disk failure = data loss
├── Single Server Process: Process crash = downtime
├── External API Dependencies: Third-party outages
└── AI Service Dependency: HuggingFace availability
```

### Mitigation Strategies
- **Backup Strategy**: Regular JSON file backups
- **Process Monitoring**: Automatic restart on failure
- **Circuit Breakers**: External API failure handling
- **Fallback Mechanisms**: AI service fallback chain

---

This architecture provides a solid foundation for the insurance testing platform while maintaining flexibility for future enhancements and scaling requirements.