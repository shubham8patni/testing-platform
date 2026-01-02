# Development Guide

## 🛠 Development Environment Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- Git
- VS Code (recommended) with Python and TypeScript extensions

### Initial Setup

1. **Clone the Repository**
```bash
git clone <repository-url>
cd insurance-testing-platform
```

2. **Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Frontend Setup**
```bash
cd frontend
npm install
```

4. **Environment Configuration**
```bash
# Copy example configurations
cp config/environments.json.example data/configs/environments.json
cp config/products.json.example data/configs/products.json
```

5. **Start Development Servers**
```bash
# Terminal 1: Backend
cd backend
uvicorn app.main:app --reload --port 8000

# Terminal 2: Frontend  
cd frontend
npm start
```

## 🏗 Project Structure

### Backend Architecture
```
backend/
├── app/
│   ├── api/v1/              # API endpoints
│   │   ├── endpoints/       # Individual endpoint modules
│   │   │   ├── users.py     # User management
│   │   │   ├── tests.py     # Test execution
│   │   │   ├── results.py   # Test results
│   │   │   ├── config.py    # Configuration
│   │   │   └── ai.py        # AI analysis
│   │   └── api.py           # API router
│   ├── core/                # Core services
│   │   ├── config.py        # Application config
│   │   └── storage.py       # JSON storage service
│   ├── services/            # Business logic
│   │   ├── test_executor.py # Test execution engine
│   │   └── ai_service.py    # AI analysis service
│   └── main.py              # FastAPI application
├── requirements.txt         # Python dependencies
└── venv/                   # Virtual environment
```

### Frontend Architecture
```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── Welcome.tsx      # User creation/landing
│   │   ├── UserDashboard.tsx # Test history
│   │   ├── TestConfig.tsx   # Test configuration
│   │   ├── TestProgress.tsx # Progress tracking
│   │   ├── ResultsView.tsx  # Results display
│   │   └── PlanDetails.tsx  # Plan inspection
│   ├── hooks/              # Custom React hooks
│   │   ├── useTestProgress.ts # Progress polling
│   │   ├── useApi.ts       # API communication
│   │   └── useAuth.ts      # Authentication
│   ├── services/           # API services
│   │   └── api.ts          # API client
│   └── types/              # TypeScript types
│       └── index.ts        # Type definitions
├── public/
│   └── index.html          # HTML template
├── package.json           # Node dependencies
└── package-lock.json      # Dependency lock file
```

### Data Storage
```
data/
├── users/                 # User configurations
│   └── {user_id}/config.json
├── configs/              # System configurations
│   ├── environments.json
│   ├── products.json
│   └── cache.json
├── tests/                # Test results
│   └── {test_id}.json
└── cache/                # Temporary cache
```

## 🔧 Development Workflow

### 1. Feature Development
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes
# ... develop your feature ...

# Run tests
npm test          # Frontend tests
pytest           # Backend tests

# Commit changes
git add .
git commit -m "feat: add your feature description"

# Push and create PR
git push origin feature/your-feature-name
```

### 2. Code Style Guidelines

#### Python Backend
- Follow PEP 8 style guide
- Use type hints for all function signatures
- Write docstrings for all public functions
- Use async/await for I/O operations

```python
# Example of good code style
async def create_test_user(
    user_data: UserCreate,
    storage: JSONStorageService = Depends(get_storage)
) -> UserResponse:
    """
    Create a new user in the system.
    
    Args:
        user_data: User creation data
        storage: Storage service dependency
        
    Returns:
        UserResponse: Created user information
        
    Raises:
        HTTPException: If user creation fails
    """
    try:
        user_id = generate_user_id(user_data.name)
        # ... implementation ...
        return UserResponse(**user_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

#### TypeScript Frontend
- Use TypeScript for all new code
- Follow React functional component patterns
- Use custom hooks for shared logic
- Implement proper error boundaries

```typescript
// Example of good component structure
interface TestConfigProps {
  onSubmit: (config: TestConfig) => void;
  loading?: boolean;
}

const TestConfig: React.FC<TestConfigProps> = ({ onSubmit, loading = false }) => {
  const [config, setConfig] = useState<TestConfig>({});

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(config);
    } catch (error) {
      console.error('Test configuration failed:', error);
    }
  }, [config, onSubmit]);

  return (
    <form onSubmit={handleSubmit}>
      {/* Component JSX */}
    </form>
  );
};
```

### 3. Testing Strategy

#### Backend Testing
```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_test_executor.py
```

#### Frontend Testing
```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### 4. API Development

#### Adding New Endpoints
1. Define Pydantic models for request/response
2. Create endpoint function with proper typing
3. Add to router in appropriate module
4. Update API documentation

```python
# Example: Adding new endpoint
from pydantic import BaseModel
from fastapi import APIRouter, Depends

class NewFeatureRequest(BaseModel):
    name: str
    config: Dict[str, Any]

class NewFeatureResponse(BaseModel):
    id: str
    status: str
    created_at: str

@router.post("/new-feature", response_model=NewFeatureResponse)
async def create_new_feature(
    request: NewFeatureRequest,
    service: FeatureService = Depends(get_feature_service)
):
    """Create a new feature in the system"""
    result = await service.create_feature(request.dict())
    return NewFeatureResponse(**result)
```

### 5. Component Development

#### Creating New React Components
1. Define TypeScript interfaces for props
2. Implement component with hooks
3. Add error handling and loading states
4. Write unit tests

```typescript
// Component template
import React, { useState, useCallback } from 'react';

interface ComponentProps {
  data: SomeType;
  onUpdate: (updated: SomeType) => void;
}

const Component: React.FC<ComponentProps> = ({ data, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = useCallback(async (newData: SomeType) => {
    setLoading(true);
    setError(null);
    
    try {
      await onUpdate(newData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [onUpdate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {/* Component content */}
    </div>
  );
};

export default Component;
```

## 🐛 Debugging Guide

### Backend Debugging

#### 1. Enable Debug Logging
```python
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

async def some_function():
    logger.debug("Starting function execution")
    # ... code ...
    logger.debug(f"Result: {result}")
```

#### 2. Using FastAPI Debug Mode
```bash
uvicorn app.main:app --reload --log-level debug
```

#### 3. Database/Storage Debugging
```python
# Add logging to storage operations
async def save_test_result(test_id: str, test_data: Dict[str, Any]) -> bool:
    logger.debug(f"Saving test result for {test_id}")
    logger.debug(f"Data: {json.dumps(test_data, indent=2)}")
    # ... implementation ...
```

### Frontend Debugging

#### 1. React DevTools
Install React DevTools browser extension for component inspection.

#### 2. Network Debugging
```typescript
// Add logging to API calls
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

apiClient.interceptors.request.use((config) => {
  console.log('API Request:', config);
  return config;
});

apiClient.interceptors.response.use((response) => {
  console.log('API Response:', response);
  return response;
});
```

#### 3. Error Boundaries
```typescript
class ErrorBoundary extends React.Component<Props, State> {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong!</div>;
    }
    return this.props.children;
  }
}
```

## 📝 Configuration Management

### Environment Variables
Create `.env` file in backend root:
```bash
# API Configuration
API_HOST=localhost
API_PORT=8000
DEBUG=true

# AI Service
HUGGINGFACE_TOKEN=your_token_here

# Storage
DATA_DIR=./data
```

### Configuration Files
Update `data/configs/` files:
- `environments.json`: API endpoints and auth
- `products.json`: Insurance product definitions
- `cache.json`: Runtime cache data

## 🚀 Building for Production

### Backend Production Build
```bash
# Install production dependencies
pip install -r requirements.txt

# Run with production server
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Frontend Production Build
```bash
# Build optimized bundle
npm run build

# Serve static files
serve -s build -l 3000
```

## 🔍 Code Review Guidelines

### Review Checklist
- [ ] Code follows style guidelines
- [ ] Proper error handling implemented
- [ ] Tests written for new functionality
- [ ] Documentation updated
- [ ] Security considerations addressed
- [ ] Performance implications considered

### Review Process
1. Create pull request with descriptive title
2. Include screenshots for UI changes
3. Link to relevant issues
4. Request review from team members
5. Address feedback promptly

## 📚 Learning Resources

### Backend Development
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Python Async/Await](https://docs.python.org/3/library/asyncio.html)
- [Pydantic Models](https://pydantic-docs.helpmanual.io/)

### Frontend Development
- [React Documentation](https://reactjs.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Hooks Guide](https://reactjs.org/docs/hooks-intro.html)

### Testing
- [Pytest Documentation](https://docs.pytest.org/)
- [Jest Documentation](https://jestjs.io/docs/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

This development guide provides comprehensive information for contributing to the insurance testing platform. Follow these guidelines to maintain code quality and consistency across the project.