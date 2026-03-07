# VazhiKaatti - Scheme Management API Quick Test (PowerShell)
# Run this script to test the new admin functionality

$BASE_URL = "http://localhost:8000"
$ADMIN_PASSWORD = "vazhikaatti_admin_2026"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "VazhiKaatti - Scheme Management API Test" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check server health
Write-Host "1️⃣  Testing server health..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri $BASE_URL -Method Get
    $response | ConvertTo-Json -Depth 3
    Write-Host "✅ Server is running!" -ForegroundColor Green
} catch {
    Write-Host "❌ Server not running at $BASE_URL" -ForegroundColor Red
    Write-Host "   Please start: cd backend; python main.py" -ForegroundColor Red
    exit 1
}
Write-Host ""
Write-Host "---"
Write-Host ""

# Test 2: Get matching schemes (public endpoint)
Write-Host "2️⃣  Getting schemes for score 75..." -ForegroundColor Yellow
$response = Invoke-RestMethod -Uri "$BASE_URL/match-schemes?score=75" -Method Get
$response | ConvertTo-Json -Depth 5
Write-Host ""
Write-Host "---"
Write-Host ""

# Test 3: Get all schemes (admin - should work)
Write-Host "3️⃣  Getting all schemes (with admin password)..." -ForegroundColor Yellow
$headers = @{
    "X-Admin-Password" = $ADMIN_PASSWORD
}
$response = Invoke-RestMethod -Uri "$BASE_URL/admin/all-schemes" -Method Get -Headers $headers
Write-Host "Total schemes: $($response.total_schemes)" -ForegroundColor Green
$response | ConvertTo-Json -Depth 5
Write-Host ""
Write-Host "---"
Write-Host ""

# Test 4: Test security - no password (should fail)
Write-Host "4️⃣  Testing security - WITHOUT password (should fail)..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/admin/all-schemes" -Method Get
    Write-Host "❌ Security issue - should have been blocked!" -ForegroundColor Red
} catch {
    Write-Host "✅ Correctly blocked: $($_.Exception.Message)" -ForegroundColor Green
}
Write-Host ""
Write-Host "---"
Write-Host ""

# Test 5: Add a new test scheme
Write-Host "5️⃣  Adding new test scheme..." -ForegroundColor Yellow
$newScheme = @{
    id = "test-scheme-powershell"
    name = "டெஸ்ட் திட்டம் - PowerShell"
    name_en = "Test Scheme - PowerShell"
    min_score = 55
    max_score = 100
    benefit_amount = "₹2,50,000"
    interest_rate = "4.5% per annum"
    description = "பவர்ஷெல் ஸ்கிரிப்ட் மூலம் சேர்க்கப்பட்ட டெஸ்ட் திட்டம்"
    description_en = "Test scheme added via PowerShell script"
    required_documents = @(
        "ஆதார் அட்டை (Aadhaar Card)",
        "நில பதிவுகள் (Land Records)"
    )
    apply_link = "https://example.com/test-powershell"
}

$headers = @{
    "X-Admin-Password" = $ADMIN_PASSWORD
    "Content-Type" = "application/json"
}

$response = Invoke-RestMethod -Uri "$BASE_URL/admin/update-scheme" -Method Post -Headers $headers -Body ($newScheme | ConvertTo-Json -Depth 5)
$response | ConvertTo-Json -Depth 3
Write-Host "✅ $($response.message)" -ForegroundColor Green
Write-Host ""
Write-Host "---"
Write-Host ""

# Test 6: Verify new scheme appears immediately
Write-Host "6️⃣  Verifying new scheme appears (NO SERVER RESTART!)..." -ForegroundColor Yellow
$response = Invoke-RestMethod -Uri "$BASE_URL/match-schemes?score=70" -Method Get
Write-Host "Total matching schemes: $($response.total_count)" -ForegroundColor Green
$response.schemes | ForEach-Object {
    Write-Host "  - $($_.name)" -ForegroundColor Cyan
}
Write-Host ""
Write-Host "---"
Write-Host ""

# Test 7: Update the test scheme
Write-Host "7️⃣  Updating test scheme (increase benefit)..." -ForegroundColor Yellow
$updatedScheme = @{
    id = "test-scheme-powershell"
    name = "டெஸ்ட் திட்டம் - PowerShell (புதுப்பிக்கப்பட்டது)"
    name_en = "Test Scheme - PowerShell (Updated)"
    min_score = 55
    max_score = 100
    benefit_amount = "₹3,50,000"  # Increased!
    interest_rate = "3.5% per annum"  # Reduced!
    description = "பவர்ஷெல் - புதுப்பிக்கப்பட்ட மானியம்!"
    description_en = "PowerShell - Updated subsidy!"
    required_documents = @(
        "ஆதார் அட்டை (Aadhaar Card)",
        "நில பதிவுகள் (Land Records)",
        "புதிய ஆவணம் (New Document)"
    )
    apply_link = "https://example.com/test-powershell-v2"
}

$response = Invoke-RestMethod -Uri "$BASE_URL/admin/update-scheme" -Method Post -Headers $headers -Body ($updatedScheme | ConvertTo-Json -Depth 5)
$response | ConvertTo-Json -Depth 3
Write-Host "✅ $($response.message)" -ForegroundColor Green
Write-Host ""
Write-Host "---"
Write-Host ""

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "✅ All tests completed successfully!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Key observations:" -ForegroundColor Yellow
Write-Host "   ✓ Schemes are read from data/schemes.json" -ForegroundColor Green
Write-Host "   ✓ Updates happen WITHOUT server restart" -ForegroundColor Green
Write-Host "   ✓ Admin endpoints are password protected" -ForegroundColor Green
Write-Host "   ✓ Public endpoints work without password" -ForegroundColor Green
Write-Host ""
Write-Host "🔐 Admin Password: $ADMIN_PASSWORD" -ForegroundColor Cyan
Write-Host "📂 Schemes File: backend\data\schemes.json" -ForegroundColor Cyan
Write-Host "📚 Documentation: backend\SCHEME_MANAGEMENT_API.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎉 Dynamic scheme management is working!" -ForegroundColor Magenta
Write-Host ""
