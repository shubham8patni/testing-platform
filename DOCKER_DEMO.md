# 🐳 Docker Setup for Cross-Platform Demo

## 🎯 Solution for Windows + WSL Issues

**Problem**: Path escaping and command interpretation issues in Windows WSL
**Solution**: Complete containerization with Docker

## 📋 Files Created

✅ **docker-compose.yml** - Complete multi-service setup
✅ **Backend/Dockerfile** - Python 3.9 + uvicorn setup  
✅ **Frontend/Dockerfile** - Python HTTP server setup
✅ **Volumes** - Persistent data storage
✅ **Networks** - Isolated network for services

## 🚀 How to Run

### Prerequisites
- Docker Desktop installed and running
- Docker Compose available

### Quick Start
```bash
cd /mnt/c/Users/Home\ PC\ SPAPSPSPTP/Desktop/internal-testing/insurance-testing-platform
docker-compose up --build
```

### Services Running

| Service | Port | Purpose | Access |
|---------|------|---------|--------|
| backend | 8001 | FastAPI with mock APIs | http://localhost:8001 |
| frontend | 3001 | HTML+JS with Bootstrap | http://localhost:3001 |

### Advantages

✅ **No Path Issues**: Container handles all file paths
✅ **Cross Platform**: Works on Windows, Mac, Linux
✅ **Isolated Network**: No port conflicts
✅ **Persistent Data**: Volumes save test results
✅ **Health Checks**: Automatic service monitoring
✅ **One Command**: Single startup for entire platform

### Docker Benefits

- **Consistency**: Same environment everywhere
- **Isolation**: No local dependency conflicts
- **Port Management**: Automatic port mapping
- **Data Persistence**: Test results saved across restarts
- **Easy Cleanup**: `docker-compose down` removes all

## 🎯 Demo Success Criteria

When you run:
1. `docker-compose up --build`
2. Open http://localhost:3001
3. Complete demo workflow functional

## 📋 Troubleshooting

### If Ports Conflict
```bash
# Change ports in docker-compose.yml
# backend: "8002:8000"
# frontend: "3002:3001"
```

### If Build Fails
```bash
# Clear Docker cache
docker system prune -f
docker-compose build --no-cache
```

### Service Management
```bash
# View logs
docker-compose logs backend
docker-compose logs frontend

# Stop all services
docker-compose down

# Rebuild specific service
docker-compose up --build backend
```

**Docker completely solves Windows + WSL path issues and provides a reliable demo environment!**
