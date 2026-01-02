# Setup Guide

This guide will help you set up the Insurance Testing Platform on your local machine.

## 🎯 Prerequisites

### Required Software

1. **Python 3.9+**
   ```bash
   python3 --version
   ```

2. **Node.js 18+**
   ```bash
   node --version
   ```

3. **Git**
   ```bash
   git --version
   ```

### Optional Software (for AI features)

4. **Hugging Face Account** (for AI analysis)
   - Create account at https://huggingface.co
   - Generate API token (free tier available)

## 🚀 Quick Setup

### Automated Setup
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/testing-platform.git
cd insurance-testing-platform

# Run the setup script
./scripts/setup.sh
```

### Manual Setup

#### Backend Setup
```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On Windows: venv\Scripts\activate
# On macOS/Linux: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create data directories
mkdir -p ../data/{users,configs,tests,cache}

# Copy example configurations
cp ../config/*.json.example ../data/configs/
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create environment file (optional)
cat > .env << EOF
REACT_APP_API_URL=http://localhost:8000/api/v1
EOF
```

## ⚙️ Configuration

### Environment Configuration
Edit `data/configs/environments.json`:

```json
{
  "environments": {
    "dev": {
      "name": "Development Environment",
      "base_url": "https://api-dev.your-company.com",
      "auth": {
        "type": "bearer",
        "token_field": "dev_token"
      }
    },
    "stage": {
      "name": "Staging Environment", 
      "base_url": "https://api-stage.your-company.com",
      "auth": {
        "type": "bearer",
        "token_field": "stage_token"
      }
    }
  }
}
```

### Product Configuration
Edit `data/configs/products.json`:

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
            "basic_plan": {
              "id": "system_plan_id",
              "name": "Basic Plan",
              "test_sequence": ["application", "payment", "policy"]
            }
          }
        }
      }
    }
  }
}
```

### Environment Variables
Create `.env` file in the project root:

```bash
# Insurance Testing Platform Configuration
DATA_DIR=./data
MAX_TESTS_PER_USER=10

# Backend settings
API_V1_STR=/api/v1
PROJECT_NAME=Insurance Testing Platform

# Hugging Face AI (optional)
HUGGINGFACE_TOKEN=your_huggingface_token_here

# Frontend proxy
PROXY=http://localhost:8000
```

## 🏃 Running the Platform

### Development Mode
```bash
# Using the provided scripts
./scripts/run_dev.sh

# Or manually start both servers:
# Terminal 1: Backend
cd backend && source venv/bin/activate && uvicorn app.main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend && npm start
```

### Access URLs
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🔧 Troubleshooting

### Common Issues

#### Backend Issues
**Port 8000 already in use**:
```bash
# Find process using port
lsof -ti:8000

# Kill process
kill -9 <PID>

# Or use different port
uvicorn app.main:app --port 8001
```

#### Frontend Issues
**npm install fails**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules

# Reinstall
npm install
```

#### Virtual Environment Issues
```bash
# Remove and recreate venv
rm -rf backend/venv
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### Database/Storage Issues
```bash
# Check data directory permissions
ls -la data/

# Create necessary directories
mkdir -p data/{users,configs,tests,cache}

# Set proper permissions
chmod 755 data/
```

### Dependency Issues

**Python package installation errors**:
```bash
# Update pip
pip install --upgrade pip

# Use specific versions if needed
pip install package==specific_version
```

**Node.js version compatibility**:
```bash
# Use nvm to manage Node versions
nvm install 18
nvm use 18
```

## 🧪 Testing the Setup

### Verify Backend
```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "insurance-testing-platform"
}
```

### Verify Frontend
```bash
curl http://localhost:3000
```

Should return HTML content of the application.

### Test API Endpoints
```bash
# Test configuration loading
curl http://localhost:8000/api/v1/config/environments

# Test user creation
curl -X POST http://localhost:8000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User"}'
```

## 📚 Next Steps

1. **Configure Your Products**: Add your actual insurance product mappings
2. **Set Up Authentication**: Configure admin/customer portal tokens
3. **Run First Test**: Test the complete workflow
4. **Configure AI**: Add Hugging Face token for AI features
5. **Customize**: Modify the platform for your specific needs

## 🆘 Getting Help

If you encounter issues:

1. Check the console output for specific error messages
2. Verify all prerequisites are installed correctly
3. Ensure no conflicts with existing software
4. Check the troubleshooting section above for common fixes

For additional support:
- Check the [API Documentation](./API_REFERENCE.md)
- Review the [Configuration Guide](./CONFIGURATION.md)
- Create an issue in the GitHub repository