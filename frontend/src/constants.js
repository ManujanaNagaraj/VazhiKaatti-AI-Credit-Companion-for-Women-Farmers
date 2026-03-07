// API Configuration
export const API_BASE_URL = 'http://localhost:8000';

// API Endpoints
export const API_ENDPOINTS = {
  VERIFY_AADHAAR: `${API_BASE_URL}/verify-aadhaar`,
  FETCH_LAND_RECORDS: `${API_BASE_URL}/fetch-land-records`,
  PREDICT_SCORE: `${API_BASE_URL}/predict-score`,
  MATCH_SCHEMES: `${API_BASE_URL}/match-schemes`,
  CROP_PRICE_PREDICTION: `${API_BASE_URL}/crop-price-prediction`,
  WEATHER_RISK: `${API_BASE_URL}/weather-risk`,
};

// LocalStorage Keys
export const STORAGE_KEYS = {
  // Farmer Profile Data
  FARMER_NAME: 'farmer_name',
  FARMER_AGE: 'farmer_age',
  FARMER_VILLAGE: 'farmer_village',
  FARMER_DISTRICT: 'farmer_district',
  FARMER_AADHAAR: 'farmer_aadhaar',
  FARMER_VERIFIED: 'farmer_verified',
  
  // Credit Score Data
  CREDIT_SCORE: 'creditScore',
  
  // Questionnaire Data
  QUESTIONNAIRE_ANSWERS: 'questionnaireAnswers',
};

// React Router Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  PROFILE: '/profile',
  QUESTIONS: '/questions',
  SCORE: '/score',
  SCHEMES: '/schemes',
  OFFICER: '/officer',
};

// Default Values
export const DEFAULTS = {
  DEMO_OTP: '1234',
  SURVEY_NUMBER: 'TN/123/456',
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  STORAGE_KEYS,
  ROUTES,
  DEFAULTS,
};
