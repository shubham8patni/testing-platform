# Insurance Testing Platform

A comprehensive template platform for insurance policy purchase testing across multiple environments.

## 🎯 Purpose

This platform enables insurance companies to test and validate their policy purchase flows across different environments (DEV/QA vs STAGE) with detailed comparison and AI-powered analysis.

## ✨ Features

- 🔧 **Environment Comparison**: Test policies across DEV/QA vs STAGE environments
- 📊 **Real-time Progress**: Live test execution tracking with 2-second polling
- 🤖 **AI Integration**: Hugging Face AI analysis of differences with local fallback
- 📈 **Plan-level Tracking**: Individual tracking for each insurance plan
- 🔍 **API Call Inspection**: Detailed view of all API calls and responses
- 👥 **User Management**: Simple user system with test history
- 📱 **Responsive UI**: Modern interface that works on desktop and mobile

## 🏗️ Architecture

```
Frontend (React + TypeScript)
    ↓
Backend (FastAPI)
    ↓
JSON File Storage
    ↓
Test Executor Engine
```

### Core Components

- **FastAPI Backend**: Async test execution with error handling
- **React Frontend**: Modern UI with real-time updates
- **JSON Storage**: File-based persistence for simplicity
- **AI Service**: Hugging Face integration with local fallback
- **Mock Engine**: Realistic test simulation for demonstration

## 🚀 Quick Start

### Prerequisites
- Python 3.9+ with pip
- Node.js 18+ with npm
- Optional: Hugging Face API token for AI features

### Setup

```bash
# Clone and setup
git clone https://github.com/YOUR_USERNAME/testing-platform.git
cd insurance-testing-platform
./scripts/setup.sh

# Start development servers
./scripts/run_dev.sh

# Access the platform
• Frontend: http://localhost:3000
• Backend API: http://localhost:8000
• API Documentation: http://localhost:8000/docs
```

## 📚 Documentation

- **[SETUP.md](./docs/SETUP.md)**: Detailed installation and configuration guide
- **[API_REFERENCE.md](./docs/API_REFERENCE.md)**: Complete API documentation
- **[CONFIGURATION.md](./docs/CONFIGURATION.md)**: Configuration guide for insurance products

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