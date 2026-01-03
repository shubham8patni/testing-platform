FROM python:3.9-slim

# Set working directory
WORKDIR /usr/share/nginx/html

# Copy frontend files
COPY . .

# Install Python (needed for simple server)
RUN apt-get update && apt-get install -y python3

# Copy simple server script
COPY start-simple.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/start-simple.sh

# Expose port
EXPOSE 3000

# Start the server
CMD ["/usr/local/bin/start-simple.sh"]
