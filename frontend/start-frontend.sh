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

# Try to start the server
cd "$(dirname "$0")"

# Method 1: Try Python http.server
if python3 -m http.server 3000 2>/dev/null; then
    echo "Frontend server started successfully using Python http.server"
else
    # Method 2: Try simple server
    if python3 -c "
import http.server
import socketserver
import threading
import time

class SimpleHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            with open('index.html', 'r') as f:
                self.send_response(200)
                self.send_header('Content-type', 'text/html')
                self.end_headers()
                self.wfile.write(f.read())
        else:
            self.send_error(404)

server = socketserver.TCPServer(('', 3000), SimpleHandler)
print('Starting frontend server at http://localhost:3000')
server.serve_forever()
" 2>/dev/null; then
        echo "Frontend server started successfully using custom server"
    else
        echo "Error: Failed to start frontend server"
        exit 1
fi