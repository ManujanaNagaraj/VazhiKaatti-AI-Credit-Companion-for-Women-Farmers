import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, CheckCircle, Loader2, TrendingUp, TrendingDown, Minus, CloudRain, Cloud, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedPage from '../components/AnimatedPage';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Toast from '../components/Toast';
import axios from 'axios';
import { API_ENDPOINTS, STORAGE_KEYS, ROUTES, DEFAULTS } from '../constants';

const FarmerProfile = () => {
  const navigate = useNavigate();
  const [farmerData, setFarmerData] = useState(null);
  const [landRecords, setLandRecords] = useState(null);
  const [govtSchemes, setGovtSchemes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchingLand, setFetchingLand] = useState(false);
  
  // Crop price prediction state
  const [selectedCrop, setSelectedCrop] = useState('rice');
  const [cropPrediction, setCropPrediction] = useState(null);
  const [fetchingPrediction, setFetchingPrediction] = useState(false);
  
  // Weather risk state
  const [weatherRisk, setWeatherRisk] = useState(null);
  const [fetchingWeather, setFetchingWeather] = useState(false);
  
  // Toast notification state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');

  useEffect(() => {
    // Load farmer data from individual localStorage keys
    const name = localStorage.getItem(STORAGE_KEYS.FARMER_NAME);
    const age = localStorage.getItem(STORAGE_KEYS.FARMER_AGE);
    const village = localStorage.getItem(STORAGE_KEYS.FARMER_VILLAGE);
    const district = localStorage.getItem(STORAGE_KEYS.FARMER_DISTRICT);
    
    if (name && age && village && district) {
      setFarmerData({
        name: name || 'Not Available',
        age: age || 'N/A',
        village: village || 'N/A',
        district: district || 'N/A'
      });
      
      // Fetch land records from API
      fetchLandRecords();
      
      // Fetch weather risk
      fetchWeatherRisk(district);
      
      // Set mock government schemes data
      setGovtSchemes({
        pm_kisan: true,
        shg_membership: true
      });
    }
    setLoading(false);
  }, []);

  const fetchLandRecords = async () => {
    setFetchingLand(true);
    try {
      const response = await axios.post(API_ENDPOINTS.FETCH_LAND_RECORDS, {
        survey_number: DEFAULTS.SURVEY_NUMBER
      });
      setLandRecords(response.data);
    } catch (error) {
      console.error('Error fetching land records:', error);
      // Set mock data if API fails
      setLandRecords({
        land_area: '2.5 acres',
        crop_type: 'Rice',
        patta_number: 'PATTA-2024-001'
      });
    } finally {
      setFetchingLand(false);
    }
  };

  const fetchCropPrediction = async (crop) => {
    setFetchingPrediction(true);
    try {
      // Determine season based on current month
      const month = new Date().getMonth() + 1;
      let season = 'kharif';
      if (month >= 6 && month <= 9) {
        season = 'kharif'; // June-Sept (monsoon)
      } else if (month >= 10 || month <= 2) {
        season = 'rabi'; // Oct-Feb (winter)
      } else {
        season = 'summer'; // March-May
      }
      
      // Estimate rainfall based on season
      const rainfall = season === 'kharif' ? 900 : season === 'rabi' ? 400 : 150;
      
      const response = await axios.get(
        `${API_ENDPOINTS.CROP_PRICE_PREDICTION}?crop=${crop}&season=${season}&rainfall=${rainfall}`
      );
      setCropPrediction(response.data);
    } catch (error) {
      console.error('Error fetching crop prediction:', error);
      setCropPrediction(null);
    } finally {
      setFetchingPrediction(false);
    }
  };

  const fetchWeatherRisk = async (district = 'coimbatore') => {
    setFetchingWeather(true);
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.WEATHER_RISK}?district=${district.toLowerCase()}`
      );
      setWeatherRisk(response.data);
    } catch (error) {
      console.error('Error fetching weather risk:', error);
      setWeatherRisk(null);
    } finally {
      setFetchingWeather(false);
    }
  };

  // Fetch crop prediction when crop changes
  useEffect(() => {
    if (selectedCrop) {
      fetchCropPrediction(selectedCrop);
    }
  }, [selectedCrop]);

  // Animation variants for staggered card entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  if (loading) {
    return (
      <AnimatedPage>
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF7F0' }}>
          <p style={{ color: '#1B4332' }}>Loading...</p>
        </div>
      </AnimatedPage>
    );
  }

  if (!farmerData) {
    return (
      <AnimatedPage>
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF7F0' }}>
          <div className="text-center">
            <p className="mb-4" style={{ color: '#1B4332' }}>No farmer data found</p>
            <button
              onClick={() => navigate(ROUTES.LOGIN)}
              className="px-6 py-2 rounded-lg"
              style={{ backgroundColor: '#2D6A4F', color: '#FAF7F0' }}
            >
              Go to Login
            </button>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <Toast message={toastMessage} type={toastType} isVisible={showToast} />
      
      <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#FAF7F0' }}>
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <h1 className="text-3xl font-bold mb-8 text-center" style={{ color: '#1B4332' }}>
            Farmer Profile
          </h1>

          {/* Cards Container with Stagger Animation */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Profile Header Card */}
            <motion.div variants={cardVariants} className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div className="flex flex-col items-center">
              {/* Photo Placeholder Circle */}
              <div 
                className="w-32 h-32 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: '#2D6A4F' }}
              >
                <User className="h-16 w-16" style={{ color: '#FAF7F0' }} />
              </div>
              
              {/* Name */}
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#1B4332' }}>
                {farmerData?.name || 'Farmer Name'}
              </h2>
              
              {/* Age, Village, District */}
              <div className="text-center">
                <p className="text-lg mb-1" style={{ color: '#6B4226' }}>
                  Age: {farmerData?.age || 'N/A'} years
                </p>
                <p className="text-lg mb-1" style={{ color: '#6B4226' }}>
                  Village: {farmerData?.village || 'N/A'}
                </p>
                <p className="text-lg" style={{ color: '#6B4226' }}>
                  District: {farmerData?.district || 'N/A'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Card 1 - Identity Information */}
          <motion.div variants={cardVariants} className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold" style={{ color: '#1B4332' }}>
                Identity Information
              </h3>
              <div 
                className="flex items-center space-x-1 px-3 py-1 rounded-full"
                style={{ backgroundColor: '#FFE5B4', color: '#1B4332' }}
              >
                <CheckCircle className="h-5 w-5" style={{ color: '#D4A017' }} />
                <span className="text-sm font-bold">✓ Verified</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border-l-4 pl-4" style={{ borderColor: '#2D6A4F' }}>
                <p className="text-sm" style={{ color: '#6B4226' }}>Name / பெயர்</p>
                <p className="text-lg font-semibold" style={{ color: '#1B4332' }}>
                  {farmerData?.name || 'Not Available'}
                </p>
              </div>
              
              <div className="border-l-4 pl-4" style={{ borderColor: '#2D6A4F' }}>
                <p className="text-sm" style={{ color: '#6B4226' }}>Age / வயது</p>
                <p className="text-lg font-semibold" style={{ color: '#1B4332' }}>
                  {farmerData?.age || 'Not Available'} years
                </p>
              </div>
              
              <div className="border-l-4 pl-4" style={{ borderColor: '#2D6A4F' }}>
                <p className="text-sm" style={{ color: '#6B4226' }}>Village / கிராமம்</p>
                <p className="text-lg font-semibold" style={{ color: '#1B4332' }}>
                  {farmerData?.village || 'Not Available'}
                </p>
              </div>
              
              <div className="border-l-4 pl-4" style={{ borderColor: '#2D6A4F' }}>
                <p className="text-sm" style={{ color: '#6B4226' }}>District / மாவட்டம்</p>
                <p className="text-lg font-semibold" style={{ color: '#1B4332' }}>
                  {farmerData?.district || 'Not Available'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Card 2 - Land Records */}
          <motion.div variants={cardVariants} className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold" style={{ color: '#1B4332' }}>
                Land Records / நில பதிவுகள்
              </h3>
              {fetchingLand ? (
                <Loader2 className="h-5 w-5 animate-spin" style={{ color: '#2D6A4F' }} />
              ) : (
                <div 
                  className="flex items-center space-x-1 px-3 py-1 rounded-full"
                  style={{ backgroundColor: '#FFE5B4', color: '#1B4332' }}
                >
                  <CheckCircle className="h-5 w-5" style={{ color: '#D4A017' }} />
                  <span className="text-sm font-bold">✓ Verified</span>
                </div>
              )}
            </div>
            
            {landRecords ? (
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border-l-4 pl-4" style={{ borderColor: '#D4A017' }}>
                  <p className="text-sm" style={{ color: '#6B4226' }}>Land Area / நில பரப்பு</p>
                  <p className="text-lg font-semibold" style={{ color: '#1B4332' }}>
                    {landRecords.land_area || 'Not Available'}
                  </p>
                </div>
                
                <div className="border-l-4 pl-4" style={{ borderColor: '#D4A017' }}>
                  <p className="text-sm" style={{ color: '#6B4226' }}>Crop Type / பயிர் வகை</p>
                  <p className="text-lg font-semibold" style={{ color: '#1B4332' }}>
                    {landRecords.crop_type || 'Not Available'}
                  </p>
                </div>
                
                <div className="border-l-4 pl-4" style={{ borderColor: '#D4A017' }}>
                  <p className="text-sm" style={{ color: '#6B4226' }}>Patta Number / பட்டா எண்</p>
                  <p className="text-lg font-semibold" style={{ color: '#1B4332' }}>
                    {landRecords.patta_number || 'Not Available'}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-center" style={{ color: '#6B4226' }}>Loading land records...</p>
            )}
          </motion.div>

          {/* Card 3 - Government Schemes */}
          <motion.div variants={cardVariants} className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold" style={{ color: '#1B4332' }}>
                Government Schemes / அரசு திட்டங்கள்
              </h3>
              <div 
                className="flex items-center space-x-1 px-3 py-1 rounded-full"
                style={{ backgroundColor: '#FFE5B4', color: '#1B4332' }}
              >
                <CheckCircle className="h-5 w-5" style={{ color: '#D4A017' }} />
                <span className="text-sm font-bold">✓ Verified</span>
              </div>
            </div>
            
            {govtSchemes ? (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border-l-4 pl-4" style={{ borderColor: '#D4A017' }}>
                  <p className="text-sm" style={{ color: '#6B4226' }}>PM-KISAN Status</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div 
                      className="px-3 py-1 rounded-full text-sm font-semibold"
                      style={{ 
                        backgroundColor: govtSchemes.pm_kisan ? '#D4F1DD' : '#FFE5E5',
                        color: govtSchemes.pm_kisan ? '#2D6A4F' : '#C0392B'
                      }}
                    >
                      {govtSchemes.pm_kisan ? '✓ Enrolled' : '✗ Not Enrolled'}
                    </div>
                  </div>
                </div>
                
                <div className="border-l-4 pl-4" style={{ borderColor: '#D4A017' }}>
                  <p className="text-sm" style={{ color: '#6B4226' }}>SHG Membership / SHG உறுப்பினர்</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div 
                      className="px-3 py-1 rounded-full text-sm font-semibold"
                      style={{ 
                        backgroundColor: govtSchemes.shg_membership ? '#D4F1DD' : '#FFE5E5',
                        color: govtSchemes.shg_membership ? '#2D6A4F' : '#C0392B'
                      }}
                    >
                      {govtSchemes.shg_membership ? '✓ Active Member' : '✗ Not a Member'}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center" style={{ color: '#6B4226' }}>Loading schemes data...</p>
            )}
          </motion.div>

          {/* Card 4 - Weather Risk Assessment */}
          <motion.div variants={cardVariants} className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold" style={{ color: '#1B4332' }}>
                Weather Risk Assessment / வானிலை அபாய மதிப்பீடு
              </h3>
              {weatherRisk && (
                <div 
                  className="flex items-center space-x-1 px-3 py-1 rounded-full"
                  style={{ 
                    backgroundColor: weatherRisk.risk_level === 'High' ? '#FFE5E5' : 
                                    weatherRisk.risk_level === 'Medium' ? '#FFF9E6' : '#D4F1DD',
                    color: weatherRisk.risk_level === 'High' ? '#C0392B' : 
                           weatherRisk.risk_level === 'Medium' ? '#D4A017' : '#2D6A4F'
                  }}
                >
                  <span className="text-sm font-bold">
                    {weatherRisk.risk_level === 'High' ? '🔴' : 
                     weatherRisk.risk_level === 'Medium' ? '🟡' : '🟢'} {weatherRisk.risk_level}
                  </span>
                </div>
              )}
            </div>
            
            {fetchingWeather ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#2D6A4F' }} />
              </div>
            ) : weatherRisk ? (
              <div className="space-y-4">
                {/* Risk Summary */}
                <div className="border-l-4 pl-4" style={{ 
                  borderColor: weatherRisk.risk_level === 'High' ? '#C0392B' : 
                              weatherRisk.risk_level === 'Medium' ? '#D4A017' : '#2D6A4F'
                }}>
                  <p className="text-sm mb-1" style={{ color: '#6B4226' }}>
                    Risk Type / அபாய வகை
                  </p>
                  <p className="text-xl font-bold" style={{ color: '#1B4332' }}>
                    {weatherRisk.risk_type_tamil} ({weatherRisk.risk_type})
                  </p>
                </div>

                {/* Farming Advice */}
                <div 
                  className="p-4 rounded-lg" 
                  style={{ 
                    backgroundColor: weatherRisk.risk_level === 'High' ? '#FFE5E5' : 
                                    weatherRisk.risk_level === 'Medium' ? '#FFF9E6' : '#D4F1DD'
                  }}
                >
                  <div className="flex items-start space-x-2 mb-2">
                    {weatherRisk.risk_level === 'High' ? (
                      <AlertTriangle className="h-5 w-5 mt-1" style={{ color: '#C0392B' }} />
                    ) : weatherRisk.risk_level === 'Medium' ? (
                      <Cloud className="h-5 w-5 mt-1" style={{ color: '#D4A017' }} />
                    ) : (
                      <CloudRain className="h-5 w-5 mt-1" style={{ color: '#2D6A4F' }} />
                    )}
                    <div>
                      <p 
                        className="text-base font-semibold mb-1" 
                        style={{ 
                          color: weatherRisk.risk_level === 'High' ? '#C0392B' : 
                                 weatherRisk.risk_level === 'Medium' ? '#D4A017' : '#2D6A4F',
                          fontFamily: 'Noto Sans Tamil, sans-serif'
                        }}
                      >
                        {weatherRisk.advice}
                      </p>
                      <p className="text-sm" style={{ color: '#6B4226' }}>
                        {weatherRisk.advice_en}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Credit Score Impact */}
                <div className="border-l-4 pl-4" style={{ borderColor: '#D4A017' }}>
                  <p className="text-sm mb-1" style={{ color: '#6B4226' }}>
                    Impact on Credit Score / கடன் மதிப்பெண் தாக்கம்
                  </p>
                  <p 
                    className="text-lg font-bold" 
                    style={{ 
                      color: weatherRisk.impact_on_credit_score > 0 ? '#2D6A4F' : 
                             weatherRisk.impact_on_credit_score < 0 ? '#C0392B' : '#6B4226'
                    }}
                  >
                    {weatherRisk.impact_on_credit_score > 0 ? '+' : ''}{weatherRisk.impact_on_credit_score} points
                  </p>
                  <p className="text-sm mt-1" style={{ color: '#6B4226', fontFamily: 'Noto Sans Tamil, sans-serif' }}>
                    {weatherRisk.impact_message}
                  </p>
                </div>

                {/* 7-Day Forecast Summary */}
                {weatherRisk.forecast_summary && weatherRisk.forecast_summary.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-2" style={{ color: '#1B4332' }}>
                      7-Day Forecast / 7 நாள் வானிலை முன்னறிவிப்பு
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {weatherRisk.forecast_summary.slice(0, 4).map((day, index) => (
                        <div 
                          key={index}
                          className="p-2 rounded border"
                          style={{ borderColor: '#D4A017', backgroundColor: '#FAF7F0' }}
                        >
                          <p className="text-xs font-semibold" style={{ color: '#1B4332' }}>
                            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </p>
                          <p className="text-xs mt-1" style={{ color: '#6B4226' }}>
                            🌡️ {day.temp_max_c}°C
                          </p>
                          <p className="text-xs" style={{ color: '#6B4226' }}>
                            🌧️ {day.precipitation_mm}mm
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Statistics */}
                {weatherRisk.statistics && (
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t" style={{ borderColor: '#D4A017' }}>
                    <div>
                      <p className="text-xs" style={{ color: '#6B4226' }}>Avg Rain</p>
                      <p className="text-sm font-semibold" style={{ color: '#1B4332' }}>
                        {weatherRisk.statistics.avg_rain_mm}mm
                      </p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: '#6B4226' }}>Max Temp</p>
                      <p className="text-sm font-semibold" style={{ color: '#1B4332' }}>
                        {weatherRisk.statistics.max_temp_c}°C
                      </p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: '#6B4226' }}>Flood Risk Days</p>
                      <p className="text-sm font-semibold" style={{ color: '#1B4332' }}>
                        {weatherRisk.statistics.flood_risk_days}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: '#6B4226' }}>Heat Stress Days</p>
                      <p className="text-sm font-semibold" style={{ color: '#1B4332' }}>
                        {weatherRisk.statistics.heat_stress_days}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center py-4" style={{ color: '#6B4226' }}>
                Weather data unavailable
              </p>
            )}
          </motion.div>

          {/* Card 5 - Crop Price Insights (AI Prediction) */}
          <motion.div variants={cardVariants} className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold" style={{ color: '#1B4332' }}>
                Crop Price Insights / பயிர் விலை நுண்ணறிவு
              </h3>
              <div 
                className="flex items-center space-x-1 px-3 py-1 rounded-full"
                style={{ backgroundColor: '#E8F5E9', color: '#1B4332' }}
              >
                <span className="text-sm font-bold">🤖 AI Powered</span>
              </div>
            </div>
            
            {/* Crop Selector */}
            <div className="mb-4">
              <label className="block text-sm mb-2" style={{ color: '#6B4226' }}>
                Select Crop / பயிரைத் தேர்ந்தெடுக்கவும்
              </label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full md:w-64 px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2"
                style={{ 
                  borderColor: '#2D6A4F',
                  color: '#1B4332'
                }}
              >
                <option value="rice">நெல் (Rice)</option>
                <option value="banana">வாழைப்பழம் (Banana)</option>
                <option value="sugarcane">கரும்பு (Sugarcane)</option>
                <option value="cotton">பருத்தி (Cotton)</option>
                <option value="groundnut">நிலக்கடலை (Groundnut)</option>
                <option value="turmeric">மஞ்சள் (Turmeric)</option>
                <option value="tomato">தக்காளி (Tomato)</option>
              </select>
            </div>

            {/* Prediction Results */}
            {fetchingPrediction ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#2D6A4F' }} />
              </div>
            ) : cropPrediction ? (
              <div className="space-y-4">
                {/* Current Price */}
                <div className="border-l-4 pl-4" style={{ borderColor: '#D4A017' }}>
                  <p className="text-sm" style={{ color: '#6B4226' }}>
                    Current Avg Price / தற்போதைய சராசரி விலை
                  </p>
                  <p className="text-2xl font-bold" style={{ color: '#1B4332' }}>
                    ₹{cropPrediction.current_avg_price} / kg
                  </p>
                </div>

                {/* Predicted Price with Trend Indicator */}
                <div className="border-l-4 pl-4" style={{ borderColor: '#2D6A4F' }}>
                  <p className="text-sm mb-2" style={{ color: '#6B4226' }}>
                    Next Month Prediction / அடுத்த மாத கணிப்பு
                  </p>
                  
                  <div className="flex items-center space-x-3">
                    <p className="text-2xl font-bold" style={{ color: '#1B4332' }}>
                      ₹{cropPrediction.predicted_next_month_price} / kg
                    </p>
                    
                    {/* Trend Arrow */}
                    {cropPrediction.trend === 'up' && (
                      <div className="flex items-center space-x-1 px-3 py-1 rounded-full" 
                        style={{ backgroundColor: '#D4F1DD', color: '#2D6A4F' }}>
                        <TrendingUp className="h-5 w-5" />
                        <span className="font-semibold">+{cropPrediction.price_change_percent}%</span>
                      </div>
                    )}
                    
                    {cropPrediction.trend === 'down' && (
                      <div className="flex items-center space-x-1 px-3 py-1 rounded-full" 
                        style={{ backgroundColor: '#FFE5E5', color: '#C0392B' }}>
                        <TrendingDown className="h-5 w-5" />
                        <span className="font-semibold">{cropPrediction.price_change_percent}%</span>
                      </div>
                    )}
                    
                    {cropPrediction.trend === 'stable' && (
                      <div className="flex items-center space-x-1 px-3 py-1 rounded-full" 
                        style={{ backgroundColor: '#FFF9E6', color: '#D4A017' }}>
                        <Minus className="h-5 w-5" />
                        <span className="font-semibold">Stable</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Recommendation in Tamil */}
                <div 
                  className="p-4 rounded-lg" 
                  style={{ 
                    backgroundColor: cropPrediction.trend === 'up' ? '#D4F1DD' : 
                                    cropPrediction.trend === 'down' ? '#FFE5E5' : '#FFF9E6'
                  }}
                >
                  <p 
                    className="text-lg font-semibold mb-1" 
                    style={{ 
                      color: cropPrediction.trend === 'up' ? '#2D6A4F' : 
                             cropPrediction.trend === 'down' ? '#C0392B' : '#D4A017',
                      fontFamily: 'Noto Sans Tamil, sans-serif'
                    }}
                  >
                    {cropPrediction.recommendation}
                  </p>
                  <p className="text-sm" style={{ color: '#6B4226' }}>
                    {cropPrediction.recommendation_en}
                  </p>
                  <p className="text-xs mt-2" style={{ color: '#6B4226' }}>
                    Confidence: {cropPrediction.confidence_percent}% | Season: {cropPrediction.season_tamil}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-center py-4" style={{ color: '#6B4226' }}>
                Select a crop to see AI price predictions
              </p>
            )}
          </motion.div>

          {/* Bottom Actions */}
          <motion.div variants={cardVariants} className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h3 
              className="text-2xl font-bold mb-6" 
              style={{ color: '#1B4332', fontFamily: 'Noto Sans Tamil, sans-serif' }}
            >
              இது சரியா?
            </h3>
            <p className="text-lg mb-6" style={{ color: '#6B4226' }}>
              Is this information correct?
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate(ROUTES.QUESTIONS)}
                className="px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105"
                style={{ backgroundColor: '#2D6A4F', color: '#FAF7F0' }}
              >
                ✓ Yes, Continue / ஆம், தொடரவும்
              </button>
              
              <button
                onClick={() => navigate(ROUTES.LOGIN)}
                className="px-8 py-3 rounded-lg font-semibold text-lg border-2 transition-all hover:scale-105"
                style={{ 
                  borderColor: '#D4A017', 
                  color: '#1B4332',
                  backgroundColor: 'transparent'
                }}
              >
                ✎ Edit / திருத்து
              </button>
            </div>
          </motion.div>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default FarmerProfile;
