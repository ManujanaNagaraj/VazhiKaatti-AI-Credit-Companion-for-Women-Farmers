import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AnimatedPage from '../components/AnimatedPage';

const CreditScore = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScoreData();
  }, []);

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
          
          {/* Placeholder for gauge and content */}
          <div className="text-center" style={{ color: '#6B4226' }}>
            Score: {scoreData.score || scoreData.credit_score || 'N/A'}
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default CreditScore;


export default CreditScore;
