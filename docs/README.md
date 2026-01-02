# Insurance Testing Platform - Documentation Hub

## 📋 Overview

Welcome to the Insurance Testing Platform documentation. This is a comprehensive system designed for validating insurance policy purchase flows across multiple environments (DEV/QA vs STAGE) with AI-powered analysis and real-time monitoring.

## 🎯 Current Project Status

**Version**: 1.0.0-alpha  
**Status**: Active Development  
**Completion**: 65% overall  

### ✅ Completed Components
- Backend API framework (FastAPI) - 85% complete
- AI integration service - 90% complete  
- Configuration management - 95% complete
- JSON storage system - 75% complete
- Documentation - 80% complete

### 🚧 In Progress
- Real API integration - 60% complete (mock data currently)
- Frontend React components - 40% complete (components deleted, need recreation)
- Authentication system - 30% complete

## 📚 Documentation Structure

### 🚀 Getting Started
- **[SETUP.md](./SETUP.md)** - Installation and configuration guide
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Development workflow and guidelines

### 🏗 Architecture & Design
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and design patterns
- **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - Current project status and completion matrix

### 📋 Planning & Status
- **[NEXT_STEPS.md](./NEXT_STEPS.md)** - Development priorities and action items
- **[TODO.md](./TODO.md)** - Detailed task list and bug tracking
- **[CHANGELOG.md](./CHANGELOG.md)** - Version history and release notes

### 🔧 Technical References
- **[API_REFERENCE.md](./API_REFERENCE.md)** - Complete API documentation
- **[CONFIGURATION.md](./CONFIGURATION.md)** - Configuration guide for products/environments
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guide
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues and solutions

## 🚀 Quick Start

### Immediate Actions Required

⚠️ **Critical Issues to Fix:**
1. **Missing Dependencies**: Install `huggingface_hub` and other required packages
2. **Frontend Components**: React components were deleted and need to be recreated
3. **Real API Integration**: Currently using mock data instead of real insurance APIs

### Basic Setup

```bash
# Clone repository
git clone <repository-url>
cd insurance-testing-platform

# Fix dependencies first!
cd backend
pip install -r requirements.txt
# Add missing huggingface_hub
pip install huggingface_hub transformers torch

# Frontend setup
cd ../frontend
npm install

# Start development servers
cd ../backend && uvicorn app.main:app --reload --port 8000 &
cd ../frontend && npm start

# Access the platform
• Frontend: http://localhost:3000
• Backend API: http://localhost:8000  
• API Documentation: http://localhost:8000/docs
```

## 🏗️ Architecture Overview

```
Frontend (React SPA)     ←→   Backend API (FastAPI)   ←→   Storage (JSON Files)
                              ↓
                    Test Executor Engine
                              ↓
                    AI Service (Cloud + Local)
                              ↓
                    External APIs (Target/Stage)
```

### Core Components Status
- **Backend API**: ✅ Working with mock data
- **Test Executor**: ⚠️ Mock implementation, needs real APIs
- **AI Service**: ✅ Cloud + local fallback working
- **Frontend**: ⚠️ HTML complete, React components needed
- **Storage**: ✅ JSON files functional

## 🔧 Configuration

### Environment Setup
Add your environment details to `data/configs/environments.json`:

```json
{
  "environments": {
    "dev": {
      "name": "Development Environment",
      "base_url": "https://api-dev.yourcompany.com",
      "auth": {"type": "bearer", "token_field": "dev_token"}
    },
    "stage": {
      "name": "Staging Environment",
      "base_url": "https://api-stage.yourcompany.com",
      "auth": {"type": "bearer", "token_field": "stage_token"}
    }
  }
}
```

### Product Mapping
Configure your insurance products in `data/configs/products.json`:

```json
{
  "categories": {
    "car": {
      "name": "Car Insurance",
      "products": {
        "your_product_key": {
          "id": "system_product_id",
          "name": "Your Product Name",
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

## 🧪 Testing Workflow

1. **User Creation**: Enter name → Create user session
2. **Test Configuration**: Select environments, scope, tokens, AI prompt
3. **Test Execution**: Run tests across selected scope with live progress
4. **Results Analysis**: View detailed results with AI-powered insights
5. **Plan Inspection**: Click any plan to see complete API call details

## 🤖 AI Integration

The platform includes intelligent AI analysis:

### Supported Models
- **Cloud**: Hugging Face Qwen2.5-3B-Instruct (free tier)
- **Local**: SmolLM2-1.7B or Qwen2.5-3B (offline)
- **Fallback**: Rule-based comparison for critical differences

### AI Analysis Features
- Field-by-field difference detection
- Business logic impact assessment
- Severity classification (critical/warning/info)
- Actionable recommendations

## 📊 Supported Test Scopes

- **All Categories**: Test every available product and plan
- **Specific Category**: Test all plans in selected category  
- **Specific Product**: Test all plans for selected product
- **Specific Plan**: Test single plan with detailed analysis

## 🔍 API Endpoints

### Users
- `POST /api/v1/users` - Create new user
- `GET /api/v1/users/{id}` - Get user information

### Configuration
- `GET /api/v1/config/environments` - Get environment configurations
- `GET /api/v1/config/products` - Get product configurations
- `GET /api/v1/config/plan-keys` - Get flat list of available plans
- `POST /api/v1/config/reload` - Reload configuration files

### Test Execution
- `POST /api/v1/tests/start` - Start new test execution
- `GET /api/v1/tests/{id}/status` - Get test status for polling

### Results
- `GET /api/v1/results/{id}` - Get complete test results
- `GET /api/v1/results/user/{id}` - Get user's test history
- `DELETE /api/v1/results/{id}` - Delete test result

### AI Analysis
- `POST /api/v1/ai/analyze-differences` - Analyze API response differences
- `GET /api/v1/ai/usage-stats` - Get AI usage statistics

## 🎨 Frontend Components

- **Welcome**: User creation and login
- **UserDashboard**: Test history and management
- **TestConfig**: Environment and scope configuration
- **TestProgress**: Real-time test execution tracking
- **PlanDetails**: Individual plan API call inspection
- **ResultsView**: Comprehensive test results with AI analysis

## 🛠 Development

### Backend Development
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend Development
```bash
cd frontend
npm install
npm start
```

### Combined Development
```bash
./scripts/run_dev.sh
```

## 🚀 Production Deployment

### Manual Deployment
1. Setup Python environment
2. Install dependencies
3. Set production environment variables
4. Run backend with gunicorn
5. Build and serve frontend

### Docker Deployment (Future)
1. Build Docker images
2. Use docker-compose for full stack
3. Configure environment variables
4. Scale horizontally if needed

## 🧪 Testing Features

### Mock Data Generation
- Realistic API response simulation
- Configurable response times (100-500ms)
- Random failure scenarios for testing
- Proper error handling and status codes

### Comparison Engine
- Field-by-field JSON comparison
- Business logic validation
- Environment-specific noise filtering
- Severity classification system

### Real-time Updates
- 2-second polling for progress updates
- WebSocket-ready architecture (future enhancement)
- Server-sent events for live updates

## 🔒 Security Features

- Token-based authentication for API access
- Secure token storage with encryption
- User session management
- Environment-specific token handling

## 📈 Scalability

### Current Limitations
- JSON file storage (suitable for small to medium teams)
- Single-server deployment
- Mock data generation (for demonstration)

### Future Enhancements
- Database storage (PostgreSQL/MySQL)
- Distributed test execution
- Advanced caching strategies
- Microservices architecture

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request
5. Follow the existing code style and patterns

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in the `docs/` directory
- Review the API documentation at `/docs`

---

**Built with ❤️ for the insurance industry**