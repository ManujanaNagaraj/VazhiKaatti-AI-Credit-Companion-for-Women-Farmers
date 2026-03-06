# VazhiKaatti Backend API

FastAPI backend for VazhiKaatti - AI Credit Companion for Women Farmers in Tamil Nadu.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Train the ML Model

```bash
python train_model.py
```

This will:
- Load training data from `data/training_data.csv`
- Train a RandomForestClassifier
- Save model files to `models/credit_model.pkl` and `models/scaler.pkl`

### 3. Start the Server

```bash
python main.py
```

Or with uvicorn directly:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Server will start on `http://localhost:8000`

### 4. Access API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📡 API Endpoints

### Authentication & Verification

#### POST /verify-aadhaar
Verify Aadhaar number with OTP.

**Request:**
```json
{
  "aadhaar_number": "123456789012",
  "otp": "1234"
}
```

**Success Response** (OTP = "1234"):
```json
{
  "success": true,
  "message": "ஆதார் சரிபார்ப்பு வெற்றிகரமாக முடிந்தது",
  "farmer": {
    "name": "லட்சுமி குமரி",
    "age": 35,
    "village": "திருச்சி கிராமம்",
    "district": "திருச்சிராப்பள்ளி",
    "photo_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Laxmi"
  }
}
```

**Error Response** (Invalid OTP):
```json
{
  "detail": "Invalid OTP - தவறான OTP"
}
```

---

### Land Records

#### POST /fetch-land-records
Fetch land record details by survey number.

**Request:**
```json
{
  "survey_number": "TN-2024-1234"
}
```

**Response:**
```json
{
  "land_area_acres": 3.5,
  "crop_type": "காய்கறிகள் (Vegetables)",
  "ownership_name": "லட்சுமி குமரி",
  "district": "திருச்சிராப்பள்ளி",
  "patta_number": "TN-TN-2024-1234-2024"
}
```

---

### Credit Scoring

#### POST /predict-score
Predict credit score using ML model.

**Request:**
```json
{
  "years_of_farming": 8,
  "crop_type": 1,
  "annual_income_inr": 120000,
  "shg_member": true,
  "pm_kisan_registered": true,
  "has_bank_account": true,
  "existing_loans": 1,
  "land_area_acres": 2.5,
  "crop_insurance": true,
  "repayment_history": 2
}
```

**Response:**
```json
{
  "score": 68,
  "grade": "Good",
  "tamil_explanation": "உங்கள் கடன் மதிப்பெண்: 68/100 - நல்லது...",
  "factors": [
    {
      "factor": "Excellent Repayment History",
      "impact": "Positive",
      "tamil": "நல்ல திருப்பிச் செலுத்தும் பதிவு (நல்லது)"
    }
  ]
}
```

---

### Scheme Matching

#### GET /match-schemes?score={score}
Get matching Tamil Nadu government schemes.

**Request:**
```
GET /match-schemes?score=70
```

**Response:**
```json
{
  "schemes": [
    {
      "name": "தமிழ்நாடு விவசாயிகள் நலன் கடன் திட்டம்",
      "benefit_amount": "₹1,50,000 - ₹4,00,000",
      "description": "நல்ல கடன் மதிப்பெண் கொண்ட விவசாயிகளுக்கான நியாயமான வட்டி கடன்.",
      "required_documents": [...],
      "apply_link": "https://tnagri.gov.in/schemes/welfare-loan"
    }
  ],
  "total_count": 3
}
```

## 🧪 Testing

### Run API Tests

```bash
python test_api.py
```

This will test all endpoints and display results.

### Manual Testing

See [API_SAMPLES.md](API_SAMPLES.md) for curl examples and sample requests.

## 📁 Project Structure

```
backend/
├── main.py                      # FastAPI application
├── models.py                    # Pydantic models
├── schemes.py                   # Government schemes database
├── ml_model.py                  # ML model wrapper
├── train_model.py               # Model training script
├── evaluate_model.py            # Model evaluation
├── feature_analysis.py          # Feature analysis
├── validate_data.py             # Data validation
├── compare_models.py            # Model comparison
├── generate_training_data.py    # Data generation
├── test_api.py                  # API testing script
├── test_ml_model.py             # ML model tests
├── requirements.txt             # Python dependencies
├── data/
│   └── training_data.csv        # Training dataset (500 rows)
├── models/
│   ├── credit_model.pkl         # Trained ML model
│   └── scaler.pkl               # Feature scaler
└── docs/
    ├── ML_MODEL_README.md       # Model documentation
    ├── ML_QUICKSTART.md         # ML quick start guide
    └── API_SAMPLES.md           # API sample requests
```

## 🔧 Configuration

### CORS Settings

Frontend URL is configured in `main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

To allow additional origins, modify the `allow_origins` list.

## 📊 ML Model

### Features (10 inputs):

1. **years_of_farming** (0-50): Years of farming experience
2. **crop_type** (0-3): 0=Rice, 1=Vegetables, 2=Fruits, 3=Mixed
3. **annual_income_inr** (0+): Annual income in INR
4. **shg_member** (bool): Self-Help Group membership
5. **pm_kisan_registered** (bool): PM-KISAN registration
6. **has_bank_account** (bool): Bank account ownership
7. **existing_loans** (0-5): Number of existing loans
8. **land_area_acres** (0-20): Land area in acres
9. **crop_insurance** (bool): Crop insurance coverage
10. **repayment_history** (0-3): 0=Poor, 1=Fair, 2=Good, 3=Excellent

### Score Range: 0-100

- **Excellent** (81-100): Premium loan products, lowest interest
- **Good** (61-80): Standard loan products, competitive rates
- **Fair** (41-60): Basic loan products, higher collateral
- **Poor** (0-40): Limited products, guarantors required

### Model Performance:

- **Algorithm**: RandomForestClassifier (200 trees, max_depth=15)
- **Accuracy**: >85%
- **MAE**: <10 points
- **RMSE**: <12 points
- **R² Score**: >0.75

## 🗄️ Government Schemes Database

The backend includes 12 Tamil Nadu government schemes categorized by credit score:

- **Excellent (81-100)**: 3 premium schemes
- **Good (61-80)**: 3 standard schemes
- **Fair (41-60)**: 3 basic schemes
- **Poor (0-40)**: 3 starter schemes

Each scheme includes:
- Tamil name and description
- Benefit amount and interest rate
- Required documents
- Application link

## 🛠️ Development

### Add New Endpoint

1. Define Pydantic models in `models.py`
2. Add endpoint function in `main.py`
3. Update API documentation
4. Add tests in `test_api.py`

### Update ML Model

1. Modify `ml_model.py` or training data
2. Run `python train_model.py` to retrain
3. Run `python evaluate_model.py` to check performance
4. Update tests in `test_ml_model.py`

### Add New Scheme

1. Edit `schemes.py`
2. Add scheme to `SCHEMES_DATABASE`
3. Test with `/match-schemes` endpoint

## 📝 Environment Variables

Create `.env` file for production:

```
ENVIRONMENT=production
DEBUG=False
DATABASE_URL=postgresql://user:pass@localhost/vazhikaatti
SECRET_KEY=your-secret-key-here
MODEL_PATH=models/credit_model.pkl
SCALER_PATH=models/scaler.pkl
```

## 🚢 Deployment

### Docker

```bash
docker build -t vazhikaatti-backend .
docker run -p 8000:8000 vazhikaatti-backend
```

### Production Server

```bash
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## 📚 Documentation

- [ML Model Documentation](ML_MODEL_README.md)
- [ML Quick Start Guide](ML_QUICKSTART.md)
- [API Sample Requests](API_SAMPLES.md)
- [Interactive API Docs](http://localhost:8000/docs) (when server is running)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

## 📄 License

Part of the VazhiKaatti project - AI Credit Companion for Women Farmers in Tamil Nadu.

## 🆘 Support

For issues or questions:
- GitHub: https://github.com/ManujanaNagaraj/VazhiKaatti-AI-Credit-Companion-for-Women-Farmers
- Documentation: http://localhost:8000/docs
