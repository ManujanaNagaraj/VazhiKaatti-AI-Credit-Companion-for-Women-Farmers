# VazhiKaatti (வழிகாட்டி)
## AI Credit Companion for Women Farmers

VazhiKaatti is an AI-powered platform designed to empower women farmers by providing credit scoring and personalized government scheme recommendations. The platform uses machine learning to assess creditworthiness based on agricultural and socio-economic factors, making financial services more accessible to rural women farmers.

## 🌟 Features

- **AI Credit Scoring**: Machine learning-based credit assessment tailored for agricultural profiles
- **Scheme Matching**: Personalized recommendations for government schemes and loans
- **Tamil Language Support**: Full bilingual interface (Tamil & English)
- **Voice Input**: Speech-to-text for ease of use in rural settings
- **Officer Dashboard**: Verification and management portal for agricultural officers
- **Mobile-First Design**: Optimized for low-bandwidth and mobile devices

## 🏗️ Project Structure

```
VazhiKaatti/
├── backend/
│   ├── main.py                 # FastAPI server
│   ├── ml_model.py             # Credit scoring ML model
│   ├── scheme_matcher.py       # Government scheme matching
│   ├── verify.py               # Document verification service
│   ├── requirements.txt        # Python dependencies
│   └── data/
│       └── training_data.csv   # Training dataset
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── FarmerLogin.jsx
│   │   │   ├── FarmerProfile.jsx
│   │   │   ├── Questions.jsx
│   │   │   ├── CreditScore.jsx
│   │   │   ├── SchemeMatcher.jsx
│   │   │   └── OfficerDashboard.jsx
│   │   ├── components/
│   │   │   ├── VoiceInput.jsx
│   │   │   ├── TamilText.jsx
│   │   │   └── ScoreGauge.jsx
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the server:
```bash
python main.py
```

The backend server will start on `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm start
```

The frontend will open at `http://localhost:3000`

## 📊 ML Model

The credit scoring model uses Random Forest Regression trained on:
- Land size and ownership
- Annual income from agriculture
- Education level
- Loan repayment history
- Savings and financial discipline
- Self-help group membership
- Years of farming experience
- Livestock ownership
- Irrigation access

### Model Features

```python
Features = [
    'land_size',
    'annual_income',
    'age',
    'education_level',
    'family_size',
    'livestock_owned',
    'years_farming',
    'loan_history',
    'savings_amount',
    'group_membership'
]
```

## 🎯 Government Schemes Supported

- **PM-KISAN**: Pradhan Mantri Kisan Samman Nidhi
- **KCC**: Kisan Credit Card
- **MKSP**: Mahila Kisan Sashaktikaran Pariyojana
- **PMFBY**: Pradhan Mantri Fasal Bima Yojana
- **PMKSY**: Pradhan Mantri Krishi Sinchayee Yojana
- **SHG Bank Linkage**: Self-Help Group collateral-free loans
- And more...

## 🌐 API Endpoints

### Farmer APIs
- `POST /api/register` - Register new farmer
- `POST /api/calculate-credit-score` - Calculate credit score
- `GET /api/schemes/{farmer_id}` - Get matching schemes
- `POST /api/verify-document` - Verify documents

### Officer APIs
- `GET /api/officer/dashboard` - Dashboard statistics
- `GET /api/officer/pending` - Pending verifications

## 🎨 Tech Stack

### Backend
- FastAPI
- scikit-learn
- pandas, numpy
- SQLAlchemy (for production)

### Frontend
- React 18
- React Router
- Tailwind CSS
- Recharts (for data visualization)
- Lucide React (icons)
- Axios

## 🔒 Security Features

- Document verification integration
- Aadhaar authentication support
- Secure farmer ID generation
- Data encryption (in production)

## 📱 Mobile Support

- Responsive design for all screen sizes
- Voice input for accessibility
- Low-bandwidth optimization
- Offline capability (planned)

## 🌍 Localization

Full Tamil language support including:
- UI text in Tamil
- Voice recognition in Tamil
- Text-to-speech in Tamil
- Tamil keyboard support

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- **Project Lead**: VazhiKaatti Development Team
- **ML Engineer**: Credit Scoring Model
- **Frontend Developer**: React Application
- **Backend Developer**: FastAPI Services

## 📞 Contact

For questions or support:
- Email: support@vazhikaatti.in
- Phone: 1800-XXX-XXXX

## 🙏 Acknowledgments

- Government of India for scheme data
- Tamil Nadu Agricultural Department
- Women farmer communities who provided feedback
- Open source community

---

**வழிகாட்டி - வழிகாட்டும் ஒளி** (VazhiKaatti - Guiding Light)

Empowering women farmers through technology 🌾
