import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import axios from 'axios';
import AnimatedPage from '../components/AnimatedPage';

// SchemeCard Component
const SchemeCard = ({ scheme }) => {
  return (
    <div 
      className="bg-white rounded-3xl p-8 shadow-lg"
      style={{ border: '3px solid #D4A017' }}
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
      const savedScore = localStorage.getItem('creditScore');
      if (savedScore) {
        const parsed = JSON.parse(savedScore);
        setScore(parsed.score || parsed.credit_score || 74);
      } else {
        // No score available, redirect to questions
        navigate('/questions');
      }
    }
  };

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/match-schemes?score=${score}`);
      setSchemes(response.data.schemes || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching schemes:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AnimatedPage>
        <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#FAF7F0' }}>
          <div className="relative w-20 h-20 mb-4">
            <div 
              className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin"
              style={{ borderColor: '#D4A017', borderTopColor: 'transparent' }}
            />
          </div>
          <p 
            className="text-xl font-semibold" 
            style={{ color: '#1B4332', fontFamily: 'Noto Sans Tamil, sans-serif' }}
          >
            திட்டங்களை ஏற்றுகிறது...
          </p>
          <p className="text-sm mt-2" style={{ color: '#2D6A4F' }}>
            Loading schemes...
          </p>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen py-12 px-4" style={{ backgroundColor: '#FAF7F0' }}>
        <div className="max-w-6xl mx-auto">
          {/* Top Score Banner */}
          <div 
            className="mb-8 p-6 rounded-2xl shadow-lg text-center"
            style={{ 
              background: 'linear-gradient(135deg, #2D6A4F 0%, #1B4332 100%)',
              border: '3px solid #D4A017'
            }}
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
          </div>

          <h1 className="text-4xl font-bold text-center mb-8" style={{ color: '#1B4332' }}>
            Matched Schemes
          </h1>

          {/* Scheme Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {schemes.map((scheme, index) => (
              <SchemeCard key={index} scheme={scheme} />
            ))}
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default SchemesMatcher;
