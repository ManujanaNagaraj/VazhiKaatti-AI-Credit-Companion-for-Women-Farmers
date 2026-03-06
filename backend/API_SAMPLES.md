# VazhiKaatti API - Sample Requests

This file contains sample API requests for testing with curl, Postman, or other HTTP clients.

## Base URL

```
http://localhost:8000
```

## 1. Root Endpoint

**GET /**

```bash
curl http://localhost:8000/
```

Response:
```json
{
  "message": "VazhiKaatti API - Empowering Women Farmers in Tamil Nadu",
  "version": "2.0.0",
  "status": "active"
}
```

---

## 2. Verify Aadhaar

**POST /verify-aadhaar**

### Success Case (OTP = 1234)

```bash
curl -X POST http://localhost:8000/verify-aadhaar \
  -H "Content-Type: application/json" \
  -d '{
    "aadhaar_number": "123456789012",
    "otp": "1234"
  }'
```

Response:
```json
{
  "success": true,
  "message": "ஆதார் சரிபார்ப்பு வெற்றிகரமாக முடிந்தது (Aadhaar verified successfully)",
  "farmer": {
    "name": "லட்சுமி குமரி",
    "age": 35,
    "village": "திருச்சி கிராமம்",
    "district": "திருச்சிராப்பள்ளி",
    "photo_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Laxmi"
  }
}
```

### Failure Case (Invalid OTP)

```bash
curl -X POST http://localhost:8000/verify-aadhaar \
  -H "Content-Type: application/json" \
  -d '{
    "aadhaar_number": "123456789012",
    "otp": "0000"
  }'
```

Response (400 Error):
```json
{
  "detail": "Invalid OTP - தவறான OTP"
}
```

---

## 3. Fetch Land Records

**POST /fetch-land-records**

```bash
curl -X POST http://localhost:8000/fetch-land-records \
  -H "Content-Type: application/json" \
  -d '{
    "survey_number": "TN-2024-1234"
  }'
```

Response:
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

## 4. Predict Credit Score

**POST /predict-score**

### Excellent Farmer Profile

```bash
curl -X POST http://localhost:8000/predict-score \
  -H "Content-Type: application/json" \
  -d '{
    "years_of_farming": 15,
    "crop_type": 2,
    "annual_income_inr": 250000,
    "shg_member": true,
    "pm_kisan_registered": true,
    "has_bank_account": true,
    "existing_loans": 0,
    "land_area_acres": 4.5,
    "crop_insurance": true,
    "repayment_history": 3
  }'
```

### Moderate Farmer Profile

```bash
curl -X POST http://localhost:8000/predict-score \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

### New Farmer Profile

```bash
curl -X POST http://localhost:8000/predict-score \
  -H "Content-Type: application/json" \
  -d '{
    "years_of_farming": 2,
    "crop_type": 0,
    "annual_income_inr": 50000,
    "shg_member": false,
    "pm_kisan_registered": false,
    "has_bank_account": true,
    "existing_loans": 1,
    "land_area_acres": 1.0,
    "crop_insurance": false,
    "repayment_history": 1
  }'
```

Response Example:
```json
{
  "score": 68,
  "grade": "Good",
  "tamil_explanation": "உங்கள் கடன் மதிப்பெண்: 68/100 - நல்லது. இந்த மதிப்பெண் உங்கள் விவசாய அனுபவம், வருமானம் மற்றும் நிதி நடத்தையை அடிப்படையாகக் கொண்டது.",
  "factors": [
    {
      "factor": "Excellent Repayment History",
      "impact": "Positive",
      "tamil": "நல்ல திருப்பிச் செலுத்தும் பதிவு (நல்லது)"
    },
    {
      "factor": "SHG Member",
      "impact": "Positive",
      "tamil": "சுய உதவி குழு உறுப்பினர் - நல்ல தாக்கம்"
    },
    {
      "factor": "Moderate Annual Income",
      "impact": "Neutral",
      "tamil": "சராசரி ஆண்டு வருமானம் (₹1,20,000)"
    }
  ]
}
```

---

## 5. Match Schemes

**GET /match-schemes?score={score}**

### Excellent Score (81-100)

```bash
curl "http://localhost:8000/match-schemes?score=85"
```

### Good Score (61-80)

```bash
curl "http://localhost:8000/match-schemes?score=70"
```

### Fair Score (41-60)

```bash
curl "http://localhost:8000/match-schemes?score=50"
```

### Poor Score (0-40)

```bash
curl "http://localhost:8000/match-schemes?score=25"
```

Response Example:
```json
{
  "schemes": [
    {
      "name": "முதலமைச்சர் பெண் விவசாயிகள் கௌரவ திட்டம்",
      "benefit_amount": "₹5,00,000 - ₹10,00,000",
      "description": "உயர் கடன் மதிப்பெண் கொண்ட பெண் விவசாயிகளுக்கான சிறப்பு கடன் திட்டம். எந்தவொரு பாதுகாப்பும் தேவையில்லை.",
      "required_documents": [
        "ஆதார் அட்டை (Aadhaar Card)",
        "நில பதிவுகள் (Land Records)",
        "வங்கி கணக்கு விவரங்கள் (Bank Account Details)",
        "பாஸ்போர்ட் புகைப்படம் (Passport Photo)"
      ],
      "apply_link": "https://tnagri.gov.in/schemes/cmwomenfarmer"
    },
    {
      "name": "தேசிய விவசாய வளர்ச்சி திட்டம் - பெண் பிரிவு",
      "benefit_amount": "₹3,00,000 - ₹7,00,000",
      "description": "நவீன விவசாய கருவிகள் மற்றும் தொழில்நுட்பத்திற்கான கடன். மானியம் 35% வரை.",
      "required_documents": [
        "ஆதார் அட்டை (Aadhaar Card)",
        "பட்டா ஆவணம் (Patta Document)",
        "SHG உறுப்பினர் அட்டை (SHG Membership Card)",
        "வருமான சான்றிதழ் (Income Certificate)"
      ],
      "apply_link": "https://tnagri.gov.in/schemes/nadp-women"
    },
    {
      "name": "கிசான் கிரெடிட் கார்டு - மேம்படுத்தப்பட்ட",
      "benefit_amount": "₹2,00,000 - ₹5,00,000",
      "description": "விவசாய செயல்பாடுகளுக்கான நெகிழ்வான கடன் வசதி. உடனடி அனுமதி.",
      "required_documents": [
        "ஆதார் அட்டை (Aadhaar Card)",
        "நில உடைமை ஆவணங்கள் (Land Ownership Documents)",
        "வங்கி பாஸ்புக் (Bank Passbook)"
      ],
      "apply_link": "https://pmkisan.gov.in/kcc-premium"
    }
  ],
  "total_count": 3
}
```

---

## Feature Field Reference

### Crop Type Values:
- `0` = Rice (நெல்)
- `1` = Vegetables (காய்கறிகள்)
- `2` = Fruits (பழங்கள்)
- `3` = Mixed (கலப்பு)

### Repayment History Values:
- `0` = Poor (மோசம்)
- `1` = Fair (சராசரி)
- `2` = Good (நல்லது)
- `3` = Excellent (சிறந்தது)

### Score Grades:
- `0-40` = Poor (மேம்படுத்த வேண்டும்)
- `41-60` = Fair (சராசரி)
- `61-80` = Good (நல்லது)
- `81-100` = Excellent (சிறந்தது)

---

## Testing with Python

```python
import requests

# Verify Aadhaar
response = requests.post('http://localhost:8000/verify-aadhaar', json={
    'aadhaar_number': '123456789012',
    'otp': '1234'
})
print(response.json())

# Predict Score
response = requests.post('http://localhost:8000/predict-score', json={
    'years_of_farming': 8,
    'crop_type': 1,
    'annual_income_inr': 120000,
    'shg_member': True,
    'pm_kisan_registered': True,
    'has_bank_account': True,
    'existing_loans': 1,
    'land_area_acres': 2.5,
    'crop_insurance': True,
    'repayment_history': 2
})
print(response.json())

# Match Schemes
response = requests.get('http://localhost:8000/match-schemes?score=70')
print(response.json())
```

---

## Interactive API Documentation

Visit `http://localhost:8000/docs` for interactive Swagger UI documentation where you can test all endpoints directly in your browser.
