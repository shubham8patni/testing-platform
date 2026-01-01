# Insurance Testing Platform

A generic template platform for insurance policy purchase testing across multiple environments.

## Features

- 🔄 Environment comparison (Dev/QA vs Stage)
- 📊 Plan-level progress tracking
- 🤖 AI-powered difference analysis
- 💾 JSON-based storage
- 🌐 Web interface with real-time updates
- 🐳 Docker support

## Quick Start

### Manual Setup

1. **Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

2. **Frontend Setup**
```bash
cd frontend
npm install
npm start
```

3. **Access Platform**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Docker Setup

```bash
docker-compose up -d
```

## Configuration

Add your insurance product mappings to:
- `config/environments.json`
- `config/products.json`

See `config/*.json.example` for templates.

## Project Structure

```
insurance-testing-platform/
├── backend/          # FastAPI backend
├── frontend/         # React frontend
├── config/          # Configuration files
├── data/            # JSON storage
├── scripts/         # Setup scripts
└── docs/            # Documentation
```

## License

MIT License - Feel free to use and modify.