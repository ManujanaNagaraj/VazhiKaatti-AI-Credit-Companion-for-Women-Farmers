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
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF7F0' }}>
          <p style={{ color: '#1B4332' }}>Loading...</p>
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
