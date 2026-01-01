#!/bin/bash

echo "🚀 Setting up Insurance Testing Platform..."

# Check if running from correct directory
if [ ! -f "README.md" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Backend setup
echo "📦 Setting up backend..."
cd backend

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment and install dependencies
echo "Installing Python dependencies..."
source venv/bin/activate 2>/dev/null || source venv/Scripts/activate 2>/dev/null
pip install -r requirements.txt

# Copy example configs to data directory
cd ..
mkdir -p data/configs
cp config/*.json.example data/configs/ 2>/dev/null || true

# Frontend setup
echo "📦 Setting up frontend..."
cd frontend

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

# Go back to project root
cd ..

# Create necessary data directories
mkdir -p data/{users,tests,cache}

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << EOF
# Insurance Testing Platform Configuration
DATA_DIR=./data
MAX_TESTS_PER_USER=10

# Hugging Face AI (optional)
HUGGINGFACE_TOKEN=

# Backend settings
API_V1_STR=/api/v1
PROJECT_NAME=Insurance Testing Platform
EOF
fi

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Update data/configs/*.json with your actual insurance product mappings"
echo "2. Run './scripts/run_dev.sh' to start development servers"
echo "3. Access the platform at http://localhost:3000"
echo ""
echo "📚 Documentation available in docs/ directory"