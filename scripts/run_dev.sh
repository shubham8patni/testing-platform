#!/bin/bash

echo "🚀 Starting development servers..."

# Check if setup has been run
if [ ! -d "backend/venv" ]; then
    echo "❌ Backend not set up. Please run './scripts/setup.sh' first"
    exit 1
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "❌ Frontend not set up. Please run './scripts/setup.sh' first"
    exit 1
fi

# Start backend
echo "🖥️  Starting backend server..."
cd backend
source venv/bin/activate 2>/dev/null || source venv/Scripts/activate 2>/dev/null
uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!

# Start frontend
echo "🖥️  Starting frontend server..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo "✅ Servers starting..."
echo "🌐 Backend: http://localhost:8000"
echo "🌐 Frontend: http://localhost:3000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for Ctrl+C
trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait