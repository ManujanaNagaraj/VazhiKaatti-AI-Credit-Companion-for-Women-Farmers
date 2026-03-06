import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AnimatedPage from '../components/AnimatedPage';

// SchemeCard Component
const SchemeCard = ({ scheme }) => {
  return (
    <div 
      className="bg-white rounded-3xl p-8 shadow-lg"
      style={{ border: '3px solid #D4A017' }}
    >
      <div className="mb-6">
        <p className="text-sm text-gray-500">Scheme Card</p>
      </div>
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
