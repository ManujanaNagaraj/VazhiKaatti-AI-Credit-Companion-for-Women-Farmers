import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, Share2, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import AnimatedPage from '../components/AnimatedPage';
import { API_ENDPOINTS, STORAGE_KEYS, ROUTES } from '../constants';

// SchemeCard Component
const SchemeCard = ({ scheme }) => {
  return (
    <div 
      className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
      style={{ 
        border: '3px solid #D4A017',
        boxShadow: '0 10px 30px rgba(212, 160, 23, 0.1)'
      }}
    >
      {/* Scheme Name */}
      <div className="mb-6">
        <h3 
          className="text-2xl font-bold mb-2" 
          style={{ color: '#1B4332', fontFamily: 'Noto Sans Tamil, sans-serif' }}
        >
          {scheme.tamil_name || scheme.name_tamil || 'பெண் விவசாயிகள் திட்டம்'}
        </h3>
        <p className="text-lg font-semibold" style={{ color: '#2D6A4F' }}>
          {scheme.name || scheme.english_name || 'Women Farmers Scheme'}
        </p>
      </div>

      {/* Benefit Amount */}
      <div className="mb-6 text-center py-4 rounded-xl" style={{ backgroundColor: '#FFF9E6' }}>
        <p 
          className="text-4xl font-bold" 
          style={{ color: '#D4A017', fontFamily: 'Noto Sans Tamil, sans-serif' }}
        >
          {scheme.benefit_amount || scheme.amount || '₹1,00,000 வரை'}
        </p>
        <p className="text-sm mt-2" style={{ color: '#6B4226' }}>
          Maximum Benefit
        </p>
      </div>

      {/* Tamil Description */}
      <div className="mb-6">
        <p 
          className="text-base leading-relaxed" 
          style={{ color: '#2D6A4F', fontFamily: 'Noto Sans Tamil, sans-serif' }}
        >
          {scheme.tamil_description || scheme.description_tamil || 
           'இந்த திட்டம் பெண் விவசாயிகளுக்கு நிதி உதவி வழங்குகிறது. விவசாய உபகரணங்கள் வாங்க மற்றும் பயிர் சாகுபடிக்கு உதவுகிறது.'}
        </p>
      </div>

      {/* Required Documents Checklist */}
      <div className="mb-6">
        <h4 
          className="text-lg font-bold mb-3" 
          style={{ color: '#1B4332', fontFamily: 'Noto Sans Tamil, sans-serif' }}
        >
          தேவையான ஆவணங்கள்:
        </h4>
        <div className="space-y-2">
          {(scheme.documents || scheme.required_documents || [
            'ஆதார் அட்டை',
            'நில பதிவு ஆவணங்கள்',
            'வங்கி கணக்கு விவரங்கள்'
          ]).map((doc, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <div 
                className="mt-1 rounded-full p-1"
                style={{ backgroundColor: '#D4F1DD' }}
              >
                <Check size={16} style={{ color: '#27AE60' }} />
              </div>
              <p 
                className="text-sm flex-1" 
                style={{ color: '#2D6A4F', fontFamily: 'Noto Sans Tamil, sans-serif' }}
              >
                {doc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Apply Now Button */}
      <button
        className="w-full py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
        style={{ 
          backgroundColor: '#27AE60', 
          color: '#FFFFFF',
          fontFamily: 'Noto Sans Tamil, sans-serif'
        }}
      >
        இப்போதே விண்ணப்பிக்கவும்
      </button>
    </div>
  );
};

const SchemesMatcher = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [score, setScore] = useState(0);

  useEffect(() => {
    loadScore();
  }, []);

  useEffect(() => {
    if (score > 0) {
      fetchSchemes();
    }
  }, [score]);

  const loadScore = () => {
    // Try to get score from location.state first
    const stateScore = location.state?.scoreData?.score || 
                       location.state?.scoreData?.credit_score ||
                       location.state?.score;
    
    if (stateScore) {
      setScore(stateScore);
    } else {
      // Fallback: try localStorage
      const savedScore = localStorage.getItem(STORAGE_KEYS.CREDIT_SCORE);
      if (savedScore) {
        try {
          const parsed = JSON.parse(savedScore);
          setScore(parsed.score || parsed.credit_score || 0);
        } catch (e) {
          console.error('Error parsing saved score:', e);
          navigate(ROUTES.QUESTIONS);
        }
      } else {
        // No score available, redirect to questions
        navigate(ROUTES.QUESTIONS);
      }
    }
  };

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${API_ENDPOINTS.MATCH_SCHEMES}?score=${score}`);
      setSchemes(response.data.schemes || []);
    } catch (error) {
      console.error('Error fetching schemes:', error);
      setError('Failed to load schemes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const shareOnWhatsApp = () => {
    const message = `🌾 VazhiKaatti வழிகாட்டி
    
என் கடன் மதிப்பெண்: ${score}/100

நான் பின்வரும் அரசு திட்டங்களுக்கு தகுதியானவன்:
${schemes.map((s, i) => `${i + 1}. ${s.tamil_name || s.name_tamil || s.name}`).join('\n')}

பெண் விவசாயிகளே! உங்கள் மதிப்பெண்ணை இப்போது பெறுங்கள்!`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) {
    return (
      <AnimatedPage>
        <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#FAF7F0' }}>
          <motion.div 
            className="relative w-20 h-20 mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <div 
              className="absolute inset-0 rounded-full border-4 border-t-transparent"
              style={{ borderColor: '#D4A017', borderTopColor: 'transparent' }}
            />
          </motion.div>
          <motion.p 
            className="text-xl font-semibold" 
            style={{ color: '#1B4332', fontFamily: 'Noto Sans Tamil, sans-serif' }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            திட்டங்களை ஏற்றுகிறது...
          </motion.p>
          <p className="text-sm mt-2" style={{ color: '#2D6A4F' }}>
            Loading schemes...
          </p>
        </div>
      </AnimatedPage>
    );
  }

  if (error) {
    return (
      <AnimatedPage>
        <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: '#FAF7F0' }}>
          <motion.div
            className="max-w-md w-full p-8 rounded-2xl text-center"
            style={{ backgroundColor: '#FFE5E5', border: '2px solid #C0392B' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="text-xl font-bold mb-4" style={{ color: '#C0392B' }}>
              Error Loading Schemes
            </p>
            <p className="mb-6" style={{ color: '#6B4226' }}>{error}</p>
            <button
              onClick={() => fetchSchemes()}
              className="px-6 py-3 rounded-lg font-semibold"
              style={{ backgroundColor: '#D4A017', color: '#1B4332' }}
            >
              Try Again
            </button>
          </motion.div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen py-12 px-4" style={{ backgroundColor: '#FAF7F0' }}>
        <div className="max-w-6xl mx-auto">
          {/* Top Score Banner */}
          <motion.div 
            className="mb-8 p-6 rounded-2xl shadow-lg text-center"
            style={{ 
              background: 'linear-gradient(135deg, #2D6A4F 0%, #1B4332 100%)',
              border: '3px solid #D4A017'
            }}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          >
            <p 
              className="text-2xl font-bold mb-2" 
              style={{ color: '#FAF7F0', fontFamily: 'Noto Sans Tamil, sans-serif' }}
            >
              உங்கள் மதிப்பெண் <span style={{ color: '#D4A017', fontSize: '2rem' }}>{score}/100</span>
            </p>
            <p 
              className="text-xl font-semibold" 
              style={{ color: '#D4F1DD', fontFamily: 'Noto Sans Tamil, sans-serif' }}
            >
              நீங்கள் இந்த திட்டங்களுக்கு தகுதியானவர்!
            </p>
            <p className="text-sm mt-2" style={{ color: '#E8F4EA' }}>
              You are eligible for these schemes!
            </p>
          </motion.div>

          <motion.h1 
            className="text-4xl font-bold text-center mb-8" 
            style={{ color: '#1B4332' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Matched Schemes
          </motion.h1>

          {/* Scheme Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {schemes.length > 0 ? (
              schemes.map((scheme, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.15, 
                    duration: 0.5,
                    type: "spring",
                    stiffness: 100
                  }}
                >
                  <SchemeCard scheme={scheme} />
                </motion.div>
              ))
            ) : (
              <motion.div 
                className="col-span-full text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p 
                  className="text-xl font-semibold mb-2" 
                  style={{ color: '#1B4332', fontFamily: 'Noto Sans Tamil, sans-serif' }}
                >
                  தற்போது உங்களுக்கான திட்டங்கள் இல்லை
                </p>
                <p className="text-sm" style={{ color: '#6B4226' }}>
                  No schemes available for your score at the moment.
                </p>
              </motion.div>
            )}
          </div>

          {/* WhatsApp Share Button */}
          {schemes.length > 0 && (
            <motion.div 
              className="flex justify-center mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <button
                onClick={shareOnWhatsApp}
                className="flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
                style={{ 
                  backgroundColor: '#25D366', 
                  color: '#FFFFFF',
                  fontFamily: 'Noto Sans Tamil, sans-serif'
                }}
              >
                <Share2 size={24} />
                <span>WhatsApp இல் பகிர்</span>
              </button>
            </motion.div>
          )}

          {/* Contact Bank Officer Button */}
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <button
              onClick={() => {
                // Open phone dialer for contact
                window.location.href = 'tel:+911800425425';
              }}
              className="flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
              style={{ 
                backgroundColor: '#D4A017', 
                color: '#1B4332',
                fontFamily: 'Noto Sans Tamil, sans-serif'
              }}
            >
              <Phone size={24} />
              <span>வங்கி அதிகாரியை தொடர்பு கொள்ளுங்கள்</span>
            </button>
          </motion.div>

          {/* Help Text */}
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <p className="text-sm" style={{ color: '#6B4226' }}>
              Need help? Call our helpline: <span className="font-bold">1800-425-425</span>
            </p>
            <p 
              className="text-sm mt-2" 
              style={{ color: '#6B4226', fontFamily: 'Noto Sans Tamil, sans-serif' }}
            >
              உதவி தேவையா? எங்கள் உதவி எண்: <span className="font-bold">1800-425-425</span>
            </p>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default SchemesMatcher;
