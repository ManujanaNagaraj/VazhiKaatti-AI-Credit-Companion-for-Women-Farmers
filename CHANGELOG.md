# Changelog

All notable changes to VazhiKaatti will be documented in this file.

## [1.0.0] - 2026-03-06

### Added
- Initial release of VazhiKaatti platform
- AI-powered credit scoring system for women farmers
- Machine learning model using Random Forest algorithm
- Government scheme matching algorithm
- Tamil language support throughout the application
- Voice input functionality for accessibility
- Landing page with feature showcase
- Farmer registration and login system
- Farmer profile creation interface
- Credit assessment questionnaire with 7 questions
- Interactive credit score display with gauge visualization
- Scheme matcher with detailed scheme information
- Officer dashboard for verification management
- Document verification service
- FastAPI backend with REST API endpoints
- React frontend with responsive design
- Tailwind CSS for styling
- Training dataset with 25 sample records

### Features
- Bilingual interface (Tamil & English)
- Speech-to-text for question answers
- Real-time credit score calculation
- Personalized scheme recommendations
- Mobile-first responsive design
- Low-bandwidth optimization

### Backend Components
- `main.py`: FastAPI server with core endpoints
- `ml_model.py`: Credit scoring ML model
- `scheme_matcher.py`: Scheme matching algorithm
- `verify.py`: Document verification service

### Frontend Components
- 7 pages: Landing, Login, Profile, Questions, Score, Schemes, Dashboard
- 3 reusable components: VoiceInput, TamilText, ScoreGauge
- React Router for navigation
- Axios for API calls

### Documentation
- README.md with project overview
- API_DOCUMENTATION.md with endpoint details
- CONTRIBUTING.md with contribution guidelines
- DEPLOYMENT.md with deployment instructions
- SECURITY.md with security policy

### Supported Schemes
- PM-KISAN
- Kisan Credit Card (KCC)
- Mahila Kisan Sashaktikaran Pariyojana
- Pradhan Mantri Fasal Bima Yojana
- Pradhan Mantri Krishi Sinchayee Yojana
- Soil Health Card Scheme
- Self Help Group Bank Linkage

## [Unreleased]

### Planned Features
- Database integration (PostgreSQL)
- User authentication with JWT
- SMS notifications
- Offline mode support
- Multi-language support (Hindi, Telugu)
- Aadhaar verification integration
- Bank account verification
- Digital signature for applications
- Real-time scheme updates
- Analytics dashboard for officers
- Mobile app (Android/iOS)
- WhatsApp bot integration
