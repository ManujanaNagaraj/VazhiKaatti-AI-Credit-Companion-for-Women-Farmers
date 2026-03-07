# VazhiKaatti - Dynamic Scheme Management API

## Overview
The scheme matching system now supports **auto-updates** without server restart! All scheme data is stored in `backend/data/schemes.json` and is read dynamically on every request.

---

## 🎯 Key Features

✅ **Dynamic Scheme Loading** - Schemes read from JSON file on every request  
✅ **No Server Restart Needed** - Update schemes via API in real-time  
✅ **Admin Protected** - Secure endpoints with password authentication  
✅ **Complete CRUD** - Add, update, and retrieve government schemes  

---

## 📂 File Structure

```
backend/
├── data/
│   └── schemes.json          # All government schemes (auto-updates)
├── main.py                   # FastAPI server with admin routes
└── schemes.py                # Deprecated (kept for reference)
```

---

## 🔧 API Endpoints

### 1. **GET /match-schemes** (Public)
Get matching schemes based on credit score - Auto-reads from JSON!

**Request:**
```bash
curl http://localhost:8000/match-schemes?score=75
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

---

### 2. **GET /admin/all-schemes** (Admin Only)
Retrieve all schemes from `schemes.json`

**Request:**
```bash
curl -X GET http://localhost:8000/admin/all-schemes \
  -H "X-Admin-Password: vazhikaatti_admin_2026"
```

**Response:**
```json
{
  "success": true,
  "total_schemes": 12,
  "schemes": [...],
  "message": "Successfully loaded 12 schemes"
}
```

---

### 3. **POST /admin/update-scheme** (Admin Only)
Add or update a scheme in `schemes.json` - **No server restart needed!**

**Request:**
```bash
curl -X POST http://localhost:8000/admin/update-scheme \
  -H "X-Admin-Password: vazhikaatti_admin_2026" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "new-scheme-2026",
    "name": "புதிய விவசாய மானியம் திட்டம்",
    "name_en": "New Agricultural Subsidy Scheme",
    "min_score": 50,
    "max_score": 100,
    "benefit_amount": "₹5,00,000",
    "interest_rate": "3% per annum",
    "description": "புதிய அரசு திட்டம் - உடனடி ஒப்புதல்",
    "description_en": "New government scheme - Instant approval",
    "required_documents": [
      "ஆதார் அட்டை (Aadhaar Card)",
      "நில பதிவுகள் (Land Records)"
    ],
    "apply_link": "https://tnagri.gov.in/new-scheme"
  }'
```

**Response:**
```json
{
  "success": true,
  "action": "added",
  "scheme_id": "new-scheme-2026",
  "message": "Scheme 'புதிய விவசாய மானியம் திட்டம்' added successfully",
  "total_schemes": 13
}
```

---

## 🔐 Admin Password

**Default Password:** `vazhikaatti_admin_2026`

⚠️ **Production:** Set via environment variable:
```python
# In main.py
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "vazhikaatti_admin_2026")
```

**Header Name:** `X-Admin-Password`

---

## 📝 Scheme Object Schema

All schemes must include these fields:

```json
{
  "id": "unique-scheme-id",              // Required: Unique identifier
  "name": "தமிழ் பெயர்",                  // Required: Tamil name
  "name_en": "English Name",             // Optional: English name
  "min_score": 0,                        // Required: Minimum credit score
  "max_score": 100,                      // Required: Maximum credit score
  "benefit_amount": "₹1,00,000",         // Required: Benefit amount
  "interest_rate": "5% per annum",       // Optional: Interest rate
  "description": "தமிழ் விளக்கம்",       // Required: Tamil description
  "description_en": "English desc",      // Optional: English description
  "required_documents": [...],           // Optional: List of documents
  "apply_link": "https://..."            // Optional: Application URL
}
```

---

## 🚀 Usage Examples

### Example 1: Add a New Government Scheme (No Restart!)

```bash
# 1. Add new PM-KISAN Plus scheme
curl -X POST http://localhost:8000/admin/update-scheme \
  -H "X-Admin-Password: vazhikaatti_admin_2026" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "pm-kisan-plus-2026",
    "name": "PM-KISAN Plus - பெண்கள் சிறப்பு திட்டம்",
    "name_en": "PM-KISAN Plus - Women Special",
    "min_score": 70,
    "max_score": 100,
    "benefit_amount": "₹15,00,000",
    "interest_rate": "2% per annum",
    "description": "2026 புதிய திட்டம் - பெண் விவசாயிகளுக்கான சிறப்பு நிதி உதவி",
    "description_en": "2026 new scheme - Special financial assistance for women farmers",
    "required_documents": [
      "ஆதார் அட்டை (Aadhaar Card)",
      "நில உரிமை ஆவணங்கள் (Land Ownership)",
      "வங்கி கணக்கு (Bank Account)"
    ],
    "apply_link": "https://pmkisan.gov.in/plus-women-2026"
  }'

# 2. Immediately test - no server restart needed!
curl http://localhost:8000/match-schemes?score=85

# The new scheme appears instantly! ✨
```

---

### Example 2: Update Existing Scheme

```bash
# Update benefit amount for an existing scheme
curl -X POST http://localhost:8000/admin/update-scheme \
  -H "X-Admin-Password: vazhikaatti_admin_2026" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "kcc-premium",
    "name": "கிசான் கிரெடிட் கார்டு - மேம்படுத்தப்பட்ட",
    "name_en": "Kisan Credit Card - Premium",
    "min_score": 81,
    "max_score": 100,
    "benefit_amount": "₹2,50,000 - ₹6,00,000",
    "interest_rate": "3.5% per annum",
    "description": "விவசாய செயல்பாடுகளுக்கான நெகிழ்வான கடன் வசதி. உடனடி அனுமதி. புதுப்பிக்கப்பட்டது!",
    "description_en": "Flexible credit facility for agricultural operations. Instant approval. Updated!",
    "required_documents": [
      "ஆதார் அட்டை (Aadhaar Card)",
      "நில உடைமை ஆவணங்கள் (Land Ownership Documents)",
      "வங்கி பாஸ்புக் (Bank Passbook)"
    ],
    "apply_link": "https://pmkisan.gov.in/kcc-premium"
  }'
```

**Response:**
```json
{
  "success": true,
  "action": "updated",
  "scheme_id": "kcc-premium",
  "message": "Scheme 'கிசான் கிரெடிட் கார்டு - மேம்படுத்தப்பட்ட' updated successfully"
}
```

---

### Example 3: Fetch All Schemes

```bash
curl -X GET http://localhost:8000/admin/all-schemes \
  -H "X-Admin-Password: vazhikaatti_admin_2026"
```

---

## 🔄 How Auto-Update Works

1. **Farmer requests schemes** → `GET /match-schemes?score=75`
2. **Server reads** `data/schemes.json` **fresh** on every request
3. **Admin updates scheme** → `POST /admin/update-scheme`
4. **File saved** to `schemes.json` immediately
5. **Next farmer request** gets updated schemes instantly!

**No server restart, no code changes, no downtime!** 🎉

---

## 🛡️ Error Handling

### Invalid Admin Password
```json
{
  "detail": "Forbidden: Invalid admin password. Use header 'X-Admin-Password'"
}
```

### Missing Required Fields
```json
{
  "detail": "Missing required fields: id, name, min_score"
}
```

### File System Errors
```json
{
  "detail": "Error saving schemes: permission denied"
}
```

---

## 📊 Testing

### Test Script
```bash
# Test all endpoints
echo "1. Testing public endpoint..."
curl http://localhost:8000/match-schemes?score=75

echo "\n2. Testing admin get schemes..."
curl -H "X-Admin-Password: vazhikaatti_admin_2026" \
  http://localhost:8000/admin/all-schemes

echo "\n3. Testing admin update scheme..."
curl -X POST http://localhost:8000/admin/update-scheme \
  -H "X-Admin-Password: vazhikaatti_admin_2026" \
  -H "Content-Type: application/json" \
  -d '{"id":"test-scheme","name":"Test","min_score":0,"max_score":100,"benefit_amount":"₹1L","description":"Test"}'

echo "\n✅ All tests completed!"
```

---

## 🎓 Use Cases

### Use Case 1: New Government Announcement
**Scenario:** Tamil Nadu announces new "Digital Farming Subsidy 2026"

**Solution:**
```bash
# Admin calls API → Scheme available immediately!
curl -X POST http://localhost:8000/admin/update-scheme \
  -H "X-Admin-Password: vazhikaatti_admin_2026" \
  -H "Content-Type: application/json" \
  -d '{...new scheme data...}'
```

### Use Case 2: Scheme Benefit Increase
**Scenario:** Government increases KCC loan limit from ₹5L to ₹7L

**Solution:**
```bash
# Update existing scheme → All users see new amount instantly!
curl -X POST http://localhost:8000/admin/update-scheme \
  -H "X-Admin-Password: vazhikaatti_admin_2026" \
  -H "Content-Type: application/json" \
  -d '{...updated benefit_amount...}'
```

### Use Case 3: Eligibility Criteria Change
**Scenario:** Reduce min_score from 61 to 55 for a scheme

**Solution:**
```bash
# Update min_score → More farmers qualify immediately!
curl -X POST http://localhost:8000/admin/update-scheme ...
```

---

## 🔧 Maintenance

### Backup schemes.json
```bash
cp backend/data/schemes.json backend/data/schemes.backup.json
```

### Manual Edit (if needed)
```bash
# Edit with UTF-8 encoding support
nano backend/data/schemes.json
# or
code backend/data/schemes.json
```

### Validate JSON
```bash
python -c "import json; json.load(open('backend/data/schemes.json', encoding='utf-8'))"
```

---

## 📚 Benefits

✅ **Real-time Updates** - Add schemes without deployment  
✅ **Fast Response** - Instant policy changes reflected  
✅ **Easy Maintenance** - JSON editing or API calls  
✅ **Admin Control** - Password-protected scheme management  
✅ **Version Control** - Track schemes.json in Git  
✅ **Disaster Recovery** - Easy backup and restore  

---

## 🚀 Production Deployment

1. Set admin password via environment variable
2. Secure `schemes.json` with proper file permissions
3. Use HTTPS for admin endpoints
4. Add rate limiting to admin APIs
5. Log all scheme updates for audit trail
6. Consider adding DELETE endpoint for scheme removal

---

**Happy Scheme Management! 🌾**
