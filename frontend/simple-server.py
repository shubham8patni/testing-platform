#!/usr/bin/env python3
import http.server
import socketserver
import os

# Change to the frontend directory
os.chdir('/mnt/c/Users/Home PC SPAPSPSPTP/Desktop/internal-testing/insurance-testing-platform/frontend')

# Server settings
PORT = 3000
Handler = http.server.SimpleHTTPRequestHandler

# Start the server
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Server running at http://localhost:{PORT}")
    print("Press Ctrl+C to stop")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped")