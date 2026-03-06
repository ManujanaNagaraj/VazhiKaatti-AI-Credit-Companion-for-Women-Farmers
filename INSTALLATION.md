# VazhiKaatti - Installation Guide

## System Requirements

### Backend
- Python 3.8 or higher
- pip (Python package manager)
- 2GB RAM minimum
- 1GB disk space

### Frontend
- Node.js 16 or higher
- npm 7 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/ManujanaNagaraj/VazhiKaatti-AI-Credit-Companion-for-Women-Farmers.git
cd VazhiKaatti-AI-Credit-Companion-for-Women-Farmers
```

### 2. Backend Setup

#### Windows

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

#### Linux/macOS

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### Configuration

Create `.env` file in backend directory:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```
DATABASE_URL=sqlite:///./vazhikaatti.db
SECRET_KEY=your-secret-key-here
```

#### Run Backend

```bash
python main.py
```

Backend will be available at `http://localhost:8000`

### 3. Frontend Setup

#### Install Dependencies

```bash
cd frontend
npm install
```

#### Configuration

Create `.env` file in frontend directory:
```bash
cp .env.example .env
```

Edit `.env`:
```
REACT_APP_API_URL=http://localhost:8000
```

#### Run Frontend

```bash
npm start
```

Frontend will open at `http://localhost:3000`

## Troubleshooting

### Backend Issues

**Problem**: Module not found
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Problem**: Port 8000 already in use
```bash
# Change port in main.py
uvicorn.run(app, host="0.0.0.0", port=8001)
```

### Frontend Issues

**Problem**: Dependencies installation fails
```bash
rm -rf node_modules package-lock.json
npm install
```

**Problem**: Port 3000 already in use
```bash
# On Windows (PowerShell)
$env:PORT=3001; npm start

# On Linux/macOS
PORT=3001 npm start
```

### Common Issues

**Problem**: CORS errors
- Ensure backend is running
- Check CORS_ORIGINS in backend .env file
- Verify REACT_APP_API_URL in frontend .env

**Problem**: Database connection errors
- Check DATABASE_URL in .env
- Ensure database file/server is accessible

## Verification

### Test Backend
```bash
curl http://localhost:8000
```

Expected output:
```json
{"message": "VazhiKaatti API - Empowering Women Farmers"}
```

### Test Frontend
Navigate to `http://localhost:3000` in your browser

## Next Steps

1. Complete the [Configuration Guide](CONFIGURATION.md)
2. Read the [User Guide](USER_GUIDE.md)
3. Review the [API Documentation](API_DOCUMENTATION.md)

## Support

For installation issues:
- Email: support@vazhikaatti.in
- GitHub Issues: [Create an issue](https://github.com/ManujanaNagaraj/VazhiKaatti-AI-Credit-Companion-for-Women-Farmers/issues)
