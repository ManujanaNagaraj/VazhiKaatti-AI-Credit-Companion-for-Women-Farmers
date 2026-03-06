import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AnimatedPage from '../components/AnimatedPage';

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
          <h1 className="text-4xl font-bold text-center mb-8" style={{ color: '#1B4332' }}>
            Matched Schemes
          </h1>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default SchemesMatcher;
