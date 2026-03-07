#!/bin/bash
# VazhiKaatti - Scheme Management API Quick Test
# Run these commands to test the new admin functionality

BASE_URL="http://localhost:8000"
ADMIN_PASSWORD="vazhikaatti_admin_2026"

echo "========================================="
echo "VazhiKaatti - Scheme Management API Test"
echo "========================================="
echo ""

# Test 1: Check server health
echo "1️⃣  Testing server health..."
curl -s "$BASE_URL" | python -m json.tool
echo ""
echo "---"
echo ""

# Test 2: Get matching schemes (public endpoint)
echo "2️⃣  Getting schemes for score 75..."
curl -s "$BASE_URL/match-schemes?score=75" | python -m json.tool
echo ""
echo "---"
echo ""

# Test 3: Get all schemes (admin - should work)
echo "3️⃣  Getting all schemes (with admin password)..."
curl -s -H "X-Admin-Password: $ADMIN_PASSWORD" \
  "$BASE_URL/admin/all-schemes" | python -m json.tool
echo ""
echo "---"
echo ""

# Test 4: Get all schemes without password (should fail)
echo "4️⃣  Testing security - getting schemes WITHOUT password (should fail)..."
curl -s "$BASE_URL/admin/all-schemes"
echo ""
echo "---"
echo ""

# Test 5: Add a new test scheme
echo "5️⃣  Adding new test scheme..."
curl -s -X POST "$BASE_URL/admin/update-scheme" \
  -H "X-Admin-Password: $ADMIN_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-scheme-bash",
    "name": "டெஸ்ட் திட்டம் - Bash",
    "name_en": "Test Scheme - Bash",
    "min_score": 50,
    "max_score": 100,
    "benefit_amount": "₹2,00,000",
    "interest_rate": "5% per annum",
    "description": "பாஷ் ஸ்கிரிப்ட் மூலம் சேர்க்கப்பட்ட டெஸ்ட் திட்டம்",
    "description_en": "Test scheme added via bash script",
    "required_documents": [
      "ஆதார் அட்டை (Aadhaar Card)",
      "நில பதிவுகள் (Land Records)"
    ],
    "apply_link": "https://example.com/test-scheme"
  }' | python -m json.tool
echo ""
echo "---"
echo ""

# Test 6: Verify new scheme appears (no restart!)
echo "6️⃣  Verifying new scheme appears immediately (no server restart!)..."
curl -s "$BASE_URL/match-schemes?score=75" | python -m json.tool
echo ""
echo "---"
echo ""

echo "========================================="
echo "✅ All tests completed!"
echo "========================================="
echo ""
echo "📝 Key observations:"
echo "   - Schemes are read from data/schemes.json"
echo "   - Updates happen WITHOUT server restart"
echo "   - Admin endpoints are password protected"
echo "   - Public endpoints work without password"
echo ""
echo "🔐 Admin Password: $ADMIN_PASSWORD"
echo "📂 Schemes File: backend/data/schemes.json"
echo ""
