# API Documentation

## Base URL
```
http://localhost:8000
```

## Authentication
Currently using simple farmer ID-based authentication. JWT authentication coming soon.

## Endpoints

### Farmer Registration
**POST** `/api/register`

Register a new farmer in the system.

**Request Body:**
```json
{
  "name": "Lakshmi Devi",
  "age": 35,
  "land_size": 2.5,
  "crop_type": "rice",
  "annual_income": 75000,
  "location": "Thanjavur",
  "education_level": "middle",
  "family_size": 4
}
```

**Response:**
```json
{
  "farmer_id": "FMR12345678",
  "status": "registered"
}
```

### Calculate Credit Score
**POST** `/api/calculate-credit-score`

Calculate credit score based on farmer's profile and answers.

**Request Body:**
```json
{
  "farmer_id": "FMR12345678",
  "answers": {
    "land_size": 2.5,
    "annual_income": 75000,
    "age": 35,
    "education_level": "middle",
    "family_size": 4,
    "livestock_owned": 3,
    "years_farming": 12,
    "loan_history": "good",
    "savings_amount": 15000,
    "group_membership": 1
  }
}
```

**Response:**
```json
{
  "farmer_id": "FMR12345678",
  "credit_score": 680,
  "category": "Good"
}
```

### Get Matching Schemes
**GET** `/api/schemes/{farmer_id}`

Get list of government schemes matching farmer's profile.

**Response:**
```json
{
  "schemes": [
    {
      "scheme_id": "PM-KISAN",
      "name": "Pradhan Mantri Kisan Samman Nidhi",
      "name_tamil": "பிரதான மந்திரி கிசான் சம்மன் நிதி",
      "description": "Direct income support",
      "benefits": "₹6000 per year",
      "match_score": 95
    }
  ]
}
```

### Verify Document
**POST** `/api/verify-document`

Verify farmer documents.

**Request Body:**
```json
{
  "farmer_id": "FMR12345678",
  "document_type": "aadhaar",
  "document_data": "1234 5678 9012"
}
```

**Response:**
```json
{
  "verified": true
}
```

### Officer Dashboard
**GET** `/api/officer/dashboard`

Get dashboard statistics for agricultural officers.

**Response:**
```json
{
  "total_farmers": 1250,
  "pending_verifications": 45,
  "approved_this_month": 89,
  "average_credit_score": 672
}
```

## Error Responses

All endpoints may return the following error responses:

**400 Bad Request**
```json
{
  "detail": "Error message"
}
```

**404 Not Found**
```json
{
  "detail": "Resource not found"
}
```

**500 Internal Server Error**
```json
{
  "detail": "Internal server error"
}
```

## Rate Limiting
- 100 requests per minute per IP
- Contact support for higher limits

## Support
For API support, contact: api-support@vazhikaatti.in
