# 🚀 DEMO INSTRUCTIONS

## ✅ **CURRENT STATUS**

### **Backend**: Ready (Port 8001)
- Backend is configured and ready to start
- FastAPI server with mock APIs
- All endpoints working with 200 responses

### **Frontend**: Ready (Port 3000) 
- Simple HTML + Bootstrap + JavaScript frontend
- Complete user workflow implemented
- Professional UI with real-time progress

## 🎯 **HOW TO RUN THE DEMO**

### **Step 1: Start Backend Server**
```bash
cd /mnt/c/Users/Home\ PC\ SPAPSPSPTP/Desktop/internal-testing/insurance-testing-platform/backend
source venv/bin/activate
PYTHONPATH=/mnt/c/Users/Home\ PC\ SPAPSPSPTP/Desktop/internal-testing/insurance-testing-platform/backend python -m uvicorn app.main:app --host 0.0.0.0 --port 8001

# Backend will be available at: http://localhost:8001
# API Documentation: http://localhost:8001/docs
```

### **Step 2: Start Frontend Server**
```bash
cd /mnt/c/Users/Home\ PC\ SPAPSPSPTP/Desktop/internal-testing/insurance-testing-platform/frontend
chmod +x start-simple.sh
./start-simple.sh

# Frontend will be available at: http://localhost:3000
```

### **Step 3: Test the Demo**
1. Open http://localhost:3000 in your browser
2. Enter any name and click "Start Testing"
3. Configure test (use default settings, tokens = "demo_token")
4. Start test and watch real-time progress
5. View results and explore features

## 🎮 **DEMO FLOW**

1. **User Creation**: Enter name → Welcome → Dashboard
2. **Test Configuration**: Select environments → Start Test → Progress
3. **Real-time Progress**: Watch individual plan progress
4. **Results Display**: View test summary and analysis
5. **Navigation**: Seamless movement between all pages

## ✅ **WHAT YOU'LL SEE**

- **Professional UI**: Bootstrap-styled interface
- **Complete Workflow**: Full user journey from creation to results
- **Real-time Updates**: Progress tracking every 2 seconds
- **API Integration**: Frontend calls backend APIs
- **Mock Data**: Realistic test responses (200 status codes)
- **Results Analysis**: Test comparison and summary display

## 🔧 **DEMO FEATURES WORKING**

✅ **Backend**: FastAPI with mock data returning 200 responses  
✅ **Frontend**: HTML+Bootstrap+JS with complete functionality  
✅ **API Integration**: Frontend successfully calls backend  
✅ **Real-time Updates**: Progress polling working  
✅ **User Interface**: Professional design and navigation  
✅ **Test Workflow**: Complete testing simulation  
✅ **Results Display**: Comprehensive test analysis  

## 🎯 **SUCCESS CRITERIA MET**

The demo is successful when you can:
- ✅ Access http://localhost:3000 and see welcome page
- ✅ Create a user and navigate to dashboard
- ✅ Configure and start a test
- ✅ Watch real-time progress updates
- ✅ View test results and comparisons
- ✅ Navigate between all pages seamlessly

## 🚨 **TROUBLESHOOTING**

### If Backend Won't Start
- Check if Python3 is available: `python3 --version`
- Check venv: `ls backend/venv`
- Check dependencies: `pip list`
- Try different port: `--port 8002`

### If Frontend Won't Start
- Check Python server: `python3 -m http.server --help`
- Check file permissions: `ls -la frontend/`
- Try manual start: `python3 -c "import http.server; http.server.HTTPServer(('localhost', 3000), http.server.SimpleHTTPRequestHandler).serve_forever()"`

### If API Calls Fail
- Check backend is running: `curl http://localhost:8001/health`
- Check CORS: Browser dev tools console
- Check network tab: Look for failed requests

## 🎉 **READY FOR DEMONSTRATION**

Your insurance testing platform is now ready for business demonstration with:
- Complete working frontend interface
- Backend API with mock integration
- Real-time progress tracking
- Professional UI design
- Full user workflow

**Start both servers and access http://localhost:3000 to begin your demo!**