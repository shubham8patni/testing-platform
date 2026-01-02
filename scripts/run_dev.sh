#!/bin/bash

echo "🚀 Starting Insurance Testing Platform - Development Mode"

# Function to check if services are running
check_backend() {
    if curl -s http://localhost:8000/health > /dev/null; then
        echo "✅ Backend already running on port 8000"
        return 0
    else
        return 1
fi

check_frontend() {
    if curl -s http://localhost:3000 > /dev/null; then
        echo "✅ Frontend already running on port 3000"
        return 0
    else
        return 1
fi

# Check prerequisites
check_prerequisites() {
    echo "📦 Checking prerequisites..."
    
    if ! command -v python3 &> /dev/null; then
        echo "❌ Python 3.9+ not found"
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js 18+ not found"
        exit 1
    fi
    
    echo "✅ Prerequisites check passed"
}

# Function to start services
start_backend() {
    echo "🖥️ Starting backend server..."
    cd backend
    
    if [ ! -d "venv" ]; then
        echo "❌ Backend virtual environment not found. Please run './scripts/setup.sh' first"
        exit 1
    fi
    
    # Activate virtual environment and start backend
    source venv/bin/activate 2>/dev/null || source venv/Scripts/activate 2>/dev/null
    
    echo "🐍 Starting FastAPI server..."
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
    BACKEND_PID=$!
    
    sleep 3
    
    if check_backend; then
        echo "✅ Backend started successfully (PID: $BACKEND_PID)"
        return 0
    else
        echo "❌ Backend failed to start"
        return 1
    fi
}

start_frontend() {
    echo "⚛️ Starting frontend server..."
    cd frontend
    
    if [ ! -d "node_modules" ]; then
        echo "❌ Frontend dependencies not installed. Please run './scripts/setup.sh' first"
        exit 1
    fi
    
    echo "🚀️ Starting React development server..."
    npm start &
    FRONTEND_PID=$!
    
    sleep 3
    
    if check_frontend; then
        echo "✅ Frontend started successfully (PID: $FRONTEND_PID)"
        return 0
    else
        echo "❌ Frontend failed to start"
        return 1
    fi
}

# Main execution
echo "📦 Checking prerequisites..."
if check_prerequisites; then
    echo "📦 Checking running services..."
    
    if check_backend && check_frontend; then
        echo "✅ Both services are already running!"
        show_access_info
    elif ! check_backend; then
        start_backend
        sleep 5
    elif ! check_frontend; then
        start_frontend
        sleep 5
    else
        start_backend
        sleep 5
        start_frontend
    fi
    
    echo ""
    echo "🎉 Both services are running!"
    show_access_info
    
    # Wait for user to stop
    echo "⏳ Services are running. Press Ctrl+C to stop both services"
    wait
}

show_access_info() {
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
}

# Trap Ctrl+C to stop both services
trap 'echo "🛑 Stopping services..."; kill $BACKEND_PID 2>/dev/null; kill $FRONTEND_PID 2>/dev/null; echo "✅ All services stopped"; exit 0' INT