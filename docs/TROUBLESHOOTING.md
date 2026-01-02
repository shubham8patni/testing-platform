# Troubleshooting Guide

## 🔧 Common Issues and Solutions

This guide covers common problems you may encounter while setting up, developing, or deploying the Insurance Testing Platform.

## 🚀 Quick Diagnostics

### System Health Check
```bash
# Check if services are running
systemctl status insurance-testing-backend
systemctl status nginx
systemctl status postgresql

# Check port availability
netstat -tulpn | grep -E ':(80|443|8000|5432|6379)'

# Check disk space
df -h

# Check memory usage
free -h
```

### Application Health Check
```bash
# Backend health
curl http://localhost:8000/health

# Frontend accessibility
curl http://localhost:3000

# API documentation
curl http://localhost:8000/docs
```

## 🐛 Development Environment Issues

### Issue: Backend Won't Start

#### Problem: Port Already in Use
```bash
# Check what's using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>

# Or use different port
uvicorn app.main:app --port 8001
```

#### Problem: Missing Dependencies
```bash
# Error: ModuleNotFoundError: No module named 'fastapi'
# Solution:
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# If huggingface_hub is missing:
pip install huggingface_hub transformers torch
```

#### Problem: Virtual Environment Issues
```bash
# recreate virtual environment
cd backend
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Issue: Frontend Won't Start

#### Problem: Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm start -- --port=3001
```

#### Problem: npm Install Fails
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

#### Problem: Module Resolution Errors
```bash
# Check if React is installed
npm list react react-dom

# Install missing dependencies
npm install react react-dom react-router-dom

# Check TypeScript configuration
npx tsc --noEmit
```

### Issue: Missing Frontend Components

#### Problem: React Components Deleted
**Symptoms**: Build fails, component import errors
```bash
# Error: Module not found: Can't resolve './components/Welcome'
```

**Solution**: Recreate missing components
1. Use `frontend/src/components/` directory structure from documentation
2. Create components based on HTML structure in `frontend/public/index.html`
3. Follow component templates in `DEVELOPMENT.md`

#### Quick Fix Steps:
```bash
# Create basic component structure
mkdir -p frontend/src/{components,hooks,services,types}

# Create index.tsx
touch frontend/src/index.tsx

# Create basic components
touch frontend/src/components/Welcome.tsx
touch frontend/src/components/TestConfig.tsx
# ... create other components
```

## 🔌 API Integration Issues

### Issue: Real API Integration Not Working

#### Problem: Authentication Token Errors
```bash
# Error: 401 Unauthorized
# Solution:
1. Check token in configuration
2. Verify token format (Bearer token)
3. Check token expiration
4. Validate API endpoints in environments.json
```

#### Problem: Connection Timeouts
```bash
# Error: Connection timeout
# Solution:
1. Check network connectivity to external APIs
2. Verify firewall rules
3. Check DNS resolution
4. Increase timeout values in requests
```

#### Problem: SSL Certificate Errors
```bash
# Error: SSL verification failed
# Solution:
1. Update SSL certificates: pip install --upgrade certifi
2. Or disable SSL verification for testing (not recommended for production)
```

### Issue: Mock Data Still Being Used

#### Problem: Tests show mock data instead of real API responses
**Symptoms**: Consistent response times, unrealistic data
```bash
# Solution:
1. Check if real API integration is enabled
2. Verify environments.json has correct URLs
3. Check if _test_plan method uses real API calls
4. Debug by adding print statements in API call functions
```

## 🤖 AI Service Issues

### Issue: HuggingFace Import Error

#### Problem: Import "huggingface_hub" could not be resolved
```bash
# Solution 1: Install missing dependency
cd backend
source venv/bin/activate
pip install huggingface_hub transformers torch

# Solution 2: Update requirements.txt
echo "huggingface_hub==0.20.3" >> backend/requirements.txt
echo "transformers==4.36.0" >> backend/requirements.txt
pip install -r requirements.txt
```

#### Problem: AI Service Returns Fallback Results
```bash
# Symptoms: Local fallback used instead of cloud AI
# Solutions:
1. Check HUGGINGFACE_TOKEN environment variable
2. Verify token is valid and active
3. Check daily usage limit exceeded
4. Verify internet connectivity
```

#### Problem: AI Analysis Too Slow
```bash
# Solutions:
1. Use smaller model for faster response
2. Implement caching for repeated analyses
3. Set timeout values appropriately
4. Use local model when possible
```

## 🗄️ Database and Storage Issues

### Issue: JSON File Storage Problems

#### Problem: File Permission Errors
```bash
# Error: Permission denied when writing to data directory
# Solution:
sudo chown -R $USER:$USER ./data
chmod -R 755 ./data
```

#### Problem: Disk Space Full
```bash
# Check disk usage
df -h

# Clean up old test results
find ./data/tests -name "*.json" -mtime +30 -delete

# Compress old results
find ./data/tests -name "*.json" -mtime +7 -exec gzip {} \;
```

### Issue: Database Connection Issues

#### Problem: PostgreSQL Connection Failed
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql

# Check connection
psql -h localhost -U insurance_user -d insurance_testing

# Reset password if needed
sudo -u postgres psql
ALTER USER insurance_user WITH PASSWORD 'new_password';
```

#### Problem: Connection Pool Exhausted
```bash
# Solutions:
1. Increase pool size in configuration
2. Add connection timeout
3. Check for connection leaks in code
4. Restart application to free connections
```

## 🌐 Network and Connectivity Issues

### Issue: Cannot Access Application

#### Problem: Localhost Access Issues
```bash
# Check if backend is running
curl http://127.0.0.1:8000/health

# Check if frontend is running
curl http://127.0.0.1:3000

# Check firewall rules
sudo ufw status
```

#### Problem: External Access Issues
```bash
# Check if port is open from external
nmap -p 80,443,8000 your-domain.com

# Check nginx configuration
sudo nginx -t

# Check if ports are listening
netstat -tulpn | grep -E ':(80|443|8000)'
```

### Issue: CORS Errors

#### Problem: Browser shows CORS errors
```bash
# Solution: Check CORS middleware in FastAPI
# In app/main.py:
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 🔒 Security and Authentication Issues

### Issue: JWT Token Problems

#### Problem: Token Validation Fails
```bash
# Solutions:
1. Check SECRET_KEY environment variable
2. Verify token format and encoding
3. Check token expiration
4. Verify algorithm consistency (HS256)
```

#### Problem: Token Refresh Issues
```bash
# Check refresh token logic
# Ensure refresh endpoint exists
# Verify refresh token storage
# Check refresh token expiration
```

## 📊 Performance Issues

### Issue: Slow API Responses

#### Problem: Response Times >5 seconds
```bash
# Profile the application
pip install py-spy
py-spy top --pid $(pgrep -f "gunicorn")

# Check database query performance
# Add logging to measure query times
# Check database indexes
# Optimize slow queries
```

#### Problem: High Memory Usage
```bash
# Monitor memory usage
htop
ps aux --sort=-%mem

# Solutions:
1. Check for memory leaks
2. Reduce worker processes
3. Optimize data structures
4. Add memory limits to Docker containers
```

### Issue: Test Execution Too Slow

#### Problem: Single test takes >30 minutes
```bash
# Solutions:
1. Run tests in parallel
2. Reduce API call timeouts
3. Implement caching
4. Check external API performance
5. Use faster hardware or scale horizontally
```

## 🔍 Debugging Techniques

### Backend Debugging

#### 1. Enable Debug Logging
```python
# In app/main.py
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Add debug prints
logger.debug("API call started")
logger.info(f"Request data: {request_data}")
```

#### 2. Use Python Debugger
```bash
# Install ipdb
pip install ipdb

# Add to code
import ipdb; ipdb.set_trace()

# Or use built-in pdb
import pdb; pdb.set_trace()
```

#### 3. Profile API Calls
```python
# Add timing decorators
import time
from functools import wraps

def timing(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        start = time.time()
        result = await func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.2f} seconds")
        return result
    return wrapper
```

### Frontend Debugging

#### 1. Browser DevTools
- Open Developer Tools (F12)
- Check Console for JavaScript errors
- Use Network tab to inspect API calls
- Use Sources tab for debugging React components

#### 2. React DevTools
- Install React DevTools browser extension
- Inspect component state and props
- Check component hierarchy
- Monitor performance

#### 3. Add Console Logging
```typescript
// Add to components
console.log('Component mounted', { props, state });

// Add error boundaries
console.error('Error caught by boundary:', error, errorInfo);
```

## 🚨 Error Messages and Solutions

### Backend Errors

#### FastAPI Error: 422 Validation Error
```bash
# Cause: Request data doesn't match Pydantic model
# Solution:
1. Check request body format
2. Verify required fields are included
3. Check data types match model definitions
4. Use Swagger docs to see expected format
```

#### Error: AttributeError: 'NoneType' object has no attribute
```bash
# Cause: Null value where object expected
# Solution:
1. Add null checks before accessing attributes
2. Use Optional types in function signatures
3. Provide default values for optional parameters
```

#### Error: ConnectionError in requests
```bash
# Cause: Network connectivity issues
# Solutions:
1. Check internet connection
2. Verify API endpoints are correct
3. Check firewall rules
4. Increase timeout values
```

### Frontend Errors

#### Error: Cannot read property of undefined
```bash
# Cause: Accessing property on null/undefined object
# Solution:
1. Add null checks: data?.property?.nestedProperty
2. Use optional chaining
3. Provide default values
```

#### Error: Network Error (Axios)
```bash
# Cause: API call failed
# Solutions:
1. Check if backend is running
2. Verify API endpoint URLs
3. Check CORS configuration
4. Check network connectivity
```

## 🔧 Maintenance Tasks

### Regular Maintenance

#### Weekly Tasks
```bash
# Check disk space
df -h

# Clean old test results
find ./data/tests -name "*.json" -mtime +7 -delete

# Check error logs
tail -n 100 /var/log/insurance-testing/error.log

# Update dependencies
cd backend && pip list --outdated
cd frontend && npm outdated
```

#### Monthly Tasks
```bash
# Database maintenance
VACUUM ANALYZE insurance_testing;

# Security updates
sudo apt update && sudo apt upgrade

# Backup verification
test -f /backup/latest/backup.sql.gz
```

### Health Monitoring

#### Create Monitoring Script
```bash
#!/bin/bash
# health_check.sh

# Check backend health
if ! curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "Backend health check failed"
    # Send alert
fi

# Check disk space
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "Disk usage high: $DISK_USAGE%"
    # Send alert
fi

# Check memory usage
MEMORY_USAGE=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
if [ $MEMORY_USAGE -gt 80 ]; then
    echo "Memory usage high: $MEMORY_USAGE%"
    # Send alert
fi
```

## 📞 Getting Help

### When to Ask for Help
- You've tried all troubleshooting steps
- Issue affects production system
- Security vulnerability discovered
- Performance degradation can't be resolved

### How to Get Help
1. **Check Documentation**: Review all docs in `/docs` directory
2. **Search Issues**: Look for similar issues in GitHub
3. **Create Issue**: Include:
   - Full error message
   - Steps to reproduce
   - System environment details
   - What you've tried already

### Information to Include in Bug Reports
```bash
# System information
uname -a
python3 --version
node --version
npm --version

# Application version
git log -1 --oneline

# Error logs
journalctl -u insurance-testing-backend --since "1 hour ago"
```

---

This troubleshooting guide covers the most common issues you'll encounter. For additional help, create an issue in the repository with detailed information about your problem.