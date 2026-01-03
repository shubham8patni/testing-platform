#!/bin/bash

echo "Starting Insurance Testing Platform Frontend..."

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "Error: python3 is required but not found"
    exit 1
fi

# Start the frontend server
echo "Starting frontend server on port 3000..."
echo "Frontend will be available at: http://localhost:3000"
echo "Press Ctrl+C to stop the server"

cd "$(dirname "$0")"
python3 -m http.server 3000

echo "Frontend server stopped"