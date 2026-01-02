#!/bin/bash

echo "🚀 Starting Insurance Testing Platform - Development Mode"

# Function to check if backend is running
check_backend() {
    if curl -s http://localhost:8000/health > /dev/null; then
        echo "✅ Backend already running on port 8000"
        return 0
    else
        return 1
fi

# Function to check if frontend is running
check_frontend() {
    if curl -s http://localhost:3000 > /dev/null; then
        echo "✅ Frontend already running on port 3000"
        return 0
    else
        return 1
fi

# Check if running from correct directory
if [ ! -f "README.md" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "📦 Checking running services..."

# Start backend if not running
if check_backend; then
    echo "🐍 Starting backend server..."
    cd backend
    
    # Check if virtual environment exists
    if [ ! -d "venv" ]; then
        echo "❌ Backend virtual environment not found. Please run ./scripts/setup.sh first"
        exit 1
    fi
    
    # Activate virtual environment and start backend
    source venv/bin/activate 2>/dev/null || source venv/Scripts/activate 2>/dev/null
    
    echo "🐍 Starting FastAPI server..."
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
    BACKEND_PID=$!
    
    # Wait a moment for backend to start
    sleep 3
    
    # Check if backend started successfully
    if check_backend; then
        echo "✅ Backend started successfully (PID: $BACKEND_PID)"
    else
        echo "❌ Backend failed to start"
        exit 1
    fi
    
    cd ..
fi

# Start frontend if not running
if check_frontend; then
    echo "⚛️ Starting frontend server..."
    cd frontend
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "❌ Frontend dependencies not installed. Please run ./scripts/setup.sh first"
        exit 1
    fi
    
    echo "⚛️ Starting React development server..."
    npm start &
    FRONTEND_PID=$!
    
    # Wait a moment for frontend to start
    sleep 3
    
    # Check if frontend started successfully
    if check_frontend; then
        echo "✅ Frontend started successfully (PID: $FRONTEND_PID)"
    else
        echo "❌ Frontend failed to start"
        exit 1
    fi
    
    cd ..
fi

echo "🎉 Both services are running!"
echo ""
echo "📍 Access URLs:"
echo "   • Frontend: http://localhost:3000"
echo "   • Backend API: http://localhost:8000"
echo "   • API Documentation: http://localhost:8000/docs"
echo ""
echo "🔄 To stop services:"
echo "   • Press Ctrl+C to stop both services"
echo ""
echo "📊 View logs:"
echo "   • Backend and frontend logs will appear below"
echo ""
echo "💡 Development tips:"
echo "   • Backend will auto-reload on file changes"
echo "   • Frontend will auto-reload on file changes"
echo "   • Use the API documentation at http://localhost:8000/docs to test endpoints"

# Trap Ctrl+C to stop both services
trap 'echo "🛑 Stopping services..."; kill $BACKEND_PID 2>/dev/null; kill $FRONTEND_PID 2>/dev/null; echo "✅ All services stopped"; exit 0' INT

# Wait for user to stop
echo "⏳ Services are running. Press Ctrl+C to stop..."
wait