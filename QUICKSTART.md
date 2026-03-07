# VazhiKaatti - Quick Start Guide
🌾 **AI Credit Companion for Women Farmers in Tamil Nadu**

## Prerequisites
- Python 3.8+ installed
- Node.js 14+ and npm installed
- Git (optional)

---

## 🚀 Quick Start (5 Minutes)

### Terminal 1: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Train the ML model
python train_model.py

# Start the FastAPI server
python -m uvicorn main:app --reload
```

**Backend runs at:** http://localhost:8000  
**API Docs:** http://localhost:8000/docs

---

### Terminal 2: Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies (first time only)
npm install

# Start the React development server
npm start
```

**Frontend runs at:** http://localhost:3001

---

## 📋 Detailed Steps

### 1️⃣ Backend Installation

```bash
cd backend
```

**Option A - Global Installation:**
```bash
pip install -r requirements.txt
```

**Option B - Virtual Environment (Recommended):**
```bash
# Create virtual environment
python -m venv venv

# Activate it
venv\Scripts\activate          # Windows
source venv/bin/activate       # Mac/Linux

# Install dependencies
pip install -r requirements.txt
```

---

### 2️⃣ Train ML Model

```bash
python train_model.py
```

**What this does:**
- Generates 1000 sample farmer records
- Trains RandomForest credit scoring model
- Saves model to `models/credit_model.pkl`
- Saves scaler to `models/scaler.pkl`

**Output:**
```
✓ Model and scaler saved successfully
✓ Model Accuracy: XX%
```

---

### 3️⃣ Start Backend Server

**Option A - Using helper script:**
```bash
python start_server.py
```

**Option B - Direct uvicorn:**
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Option C - Python module:**
```bash
python -m uvicorn main:app --reload
```

**Verify it's running:**
```bash
curl http://localhost:8000/
```

---

### 4️⃣ Start Frontend

```bash
cd frontend

# First time only
npm install

# Every time
npm start
```

**If port 3000 is busy:**
- React will automatically ask to use port 3001
- Type 'y' and press Enter

---

## ✅ Verification Checklist

- [ ] Backend running at http://localhost:8000
- [ ] API docs accessible at http://localhost:8000/docs
- [ ] Frontend running at http://localhost:3001
- [ ] Model files exist in `backend/models/`
- [ ] Training data exists in `backend/data/training_data.csv`

---

## 🧪 Test the System

### Test Backend API
```bash
# Health check
curl http://localhost:8000/

# Test scheme matcher
curl http://localhost:8000/match-schemes?score=75

# Test credit score prediction
curl -X POST http://localhost:8000/predict-score \
  -H "Content-Type: application/json" \
  -d '{
    "years_of_farming": 10,
    "crop_type": 0,
    "annual_income_inr": 100000,
    "shg_member": 1,
    "pm_kisan_registered": 1,
    "has_bank_account": 1,
    "existing_loans": 1,
    "land_area_acres": 3.0,
    "crop_insurance": 1,
    "repayment_history": 2
  }'
```

### Test Frontend
1. Open http://localhost:3001
2. Click "தொடங்குங்கள்" (Get Started)
3. Enter Aadhaar: any 12 digits
4. Enter OTP: `1234`
5. Complete profile and questions
6. View credit score and matched schemes

---

## 🐛 Troubleshooting

### Port Already in Use

**Backend (port 8000):**
```bash
uvicorn main:app --reload --port 8001
```

**Frontend:**
- React will prompt you to use a different port
- Or manually set: `PORT=3001 npm start`

### Model Files Missing
```bash
cd backend
python train_model.py
```

### Dependencies Installation Failed
```bash
pip install --upgrade pip
pip install -r requirements.txt --no-cache-dir
```

### CORS Errors
- Check that backend allows frontend port in `main.py`:
  ```python
  allow_origins=["http://localhost:3000", "http://localhost:3001"]
  ```

### Module Not Found
```bash
# Make sure you're in the backend directory
cd backend
pip install -r requirements.txt
```

---

## 📂 Project Structure

```
KCT/
├── backend/
│   ├── main.py                 # FastAPI app
│   ├── ml_model.py            # ML model class
│   ├── train_model.py         # Training script
│   ├── schemes.py             # Government schemes data
│   ├── models.py              # Pydantic models
│   ├── requirements.txt       # Python dependencies
│   ├── models/                # Trained ML models
│   │   ├── credit_model.pkl
│   │   └── scaler.pkl
│   └── data/                  # Training data
│       └── training_data.csv
└── frontend/
    ├── package.json           # Node.js dependencies
    ├── src/
    │   ├── App.js            # Main React component
    │   ├── pages/            # Page components
    │   └── components/       # Reusable components
    └── public/
```

---

## 🔗 Key URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3001 | Main application |
| Backend API | http://localhost:8000 | REST API |
| API Docs | http://localhost:8000/docs | Interactive API documentation |
| Redoc | http://localhost:8000/redoc | Alternative API docs |

---

## 🎯 Next Steps

1. **For Development:**
   - Explore the API at http://localhost:8000/docs
   - Test different farmer profiles
   - Modify schemes in `backend/schemes.py`

2. **For Production:**
   - Set up PostgreSQL database
   - Configure environment variables
   - Build frontend: `npm run build`
   - Deploy with Docker (see DEPLOYMENT.md)

---

## 📚 Additional Documentation

- [Installation Guide](INSTALLATION.md)
- [API Documentation](backend/API_DOCUMENTATION.md)
- [ML Model Guide](backend/ML_MODEL_README.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Contributing Guidelines](CONTRIBUTING.md)

---

## 💡 Support

**Need help?**
- Check the [Troubleshooting](#-troubleshooting) section
- Review API docs at http://localhost:8000/docs
- See full documentation in the repo

---

**Happy Coding! 🌾**
