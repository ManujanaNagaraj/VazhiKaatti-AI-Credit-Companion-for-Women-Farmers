import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AnimatedPage from '../components/AnimatedPage';

// Circular SVG Gauge Component  
const CircularGauge = ({ score, size = 300 }) => {
  const radius = size / 2 - 20;
  const circumference = 2 * Math.PI * radius;
  const strokeWidth = 20;
  
  // Calculate progress (score is 0-100)
  const progress = (score / 100) * circumference;
  const dashOffset = circumference - progress;
  
  // Gauge color based on score
  const getGaugeColor = () => {
    if (score <= 40) return '#C0392B'; // Red
    if (score <= 70) return '#E67E22'; // Amber
    return '#2D6A4F'; // Green
  };
  
  return (
    <svg width={size} height={size} className="mx-auto">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#E5E7EB"
        strokeWidth={strokeWidth}
      />
      
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={getGaugeColor()}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 2s ease-out, stroke 0.5s ease' }}
      />
      
      {/* Center text */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fontSize="48"
        fontWeight="bold"
        fill="#1B4332"
      >
        {score}
      </text>
    </svg>
  );
};


const CreditScore = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    loadScoreData();
  }, []);

  useEffect(() => {
    // Count-up animation for score
    if (scoreData) {
      const targetScore = scoreData.score || scoreData.credit_score || 74;
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = targetScore / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= targetScore) {
          setDisplayScore(targetScore);
          clearInterval(timer);
        } else {
          setDisplayScore(Math.floor(current));
        }
      }, duration / steps);
      
      return () => clearInterval(timer);
    }
  }, [scoreData]);

  const loadScoreData = () => {
    // Try to get score data from location.state first
    const stateData = location.state?.scoreData;
    
    if (stateData) {
      setScoreData(stateData);
      setLoading(false);
    } else {
      // Fallback: try localStorage
      const savedScore = localStorage.getItem('creditScore');
      if (savedScore) {
        const parsed = JSON.parse(savedScore);
        setScoreData(parsed);
        setLoading(false);
      } else {
        // No data available
        setLoading(false);
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

  if (!scoreData) {
    return (
      <AnimatedPage>
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF7F0' }}>
          <div className="text-center">
            <p className="mb-4" style={{ color: '#1B4332' }}>No score data available</p>
            <button
              onClick={() => navigate('/questions')}
              className="px-6 py-2 rounded-lg"
              style={{ backgroundColor: '#2D6A4F', color: '#FAF7F0' }}
            >
              Take Assessment
            </button>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen py-12 px-4" style={{ backgroundColor: '#FAF7F0' }}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8" style={{ color: '#1B4332' }}>
            Credit Score Result
          </h1>
          
          {/* Gauge */}
          <div className="bg-white rounded-3xl shadow-2xl p-12 mb-8">
            <CircularGauge score={displayScore} />
            <p 
              className="text-center mt-4 text-xl font-semibold" 
              style={{ color: '#6B4226', fontFamily: 'Noto Sans Tamil, sans-serif' }}
            >
              உங்கள் மதிப்பெண்
            </p>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default CreditScore;


export default CreditScore;
