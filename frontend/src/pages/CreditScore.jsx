import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TrendingUp, Users, Wallet } from 'lucide-react';
import confetti from 'canvas-confetti';
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

// Grade Badge Component
const GradeBadge = ({ score }) => {
  const getGrade = () => {
    if (score <= 40) return { tamil: 'மோசம்', english: 'Poor', bg: '#C0392B', text: '#FFF' };
    if (score <= 70) return { tamil: 'சாதாரண', english: 'Fair', bg: '#E67E22', text: '#FFF' };
    if (score <= 85) return { tamil: 'நல்லது', english: 'Good', bg: '#27AE60', text: '#FFF' };
    return { tamil: 'சிறந்தது', english: 'Excellent', bg: '#16A085', text: '#FFF' };
  };
  
  const grade = getGrade();
  
  return (
    <div 
      className="inline-block px-6 py-3 rounded-full shadow-lg"
      style={{ backgroundColor: grade.bg, color: grade.text }}
    >
      <div className="text-xl font-bold">{grade.tamil}</div>
      <div className="text-sm opacity-90">{grade.english}</div>
    </div>
  );
};

// Factor Card Component
const FactorCard = ({ icon: Icon, tamil, english, color }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
      <div 
        className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon size={32} style={{ color: color }} />
      </div>
      <h3 
        className="text-lg font-bold mb-1" 
        style={{ color: '#1B4332', fontFamily: 'Noto Sans Tamil, sans-serif' }}
      >
        {tamil}
      </h3>
      <p className="text-sm" style={{ color: '#6B4226' }}>{english}</p>
    </div>
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

  useEffect(() => {
    // Confetti burst for high scores (> 70)
    if (scoreData && displayScore > 0) {
      const targetScore = scoreData.score || scoreData.credit_score || 74;
      
      if (targetScore > 70) {
        // Trigger confetti after count-up animation completes
        const confettiTimer = setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#D4A017', '#2D6A4F', '#27AE60', '#16A085']
          });
        }, 2200); // Slightly after animation ends
        
        return () => clearTimeout(confettiTimer);
      }
    }
  }, [scoreData, displayScore]);

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
            
            {/* Grade Badge */}
            <div className="flex justify-center mt-6">
              <GradeBadge score={displayScore} />
            </div>
          </div>
          
          {/* Tamil Explanation */}
          {(scoreData.explanation || scoreData.tamil_explanation) && (
            <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
              <h2 
                className="text-2xl font-bold mb-4 text-center" 
                style={{ color: '#1B4332', fontFamily: 'Noto Sans Tamil, sans-serif' }}
              >
                விளக்கம்
              </h2>
              <p 
                className="text-lg leading-relaxed text-center" 
                style={{ color: '#2D6A4F', fontFamily: 'Noto Sans Tamil, sans-serif' }}
              >
                {scoreData.tamil_explanation || scoreData.explanation}
              </p>
            </div>
          )}
          
          {/* Contributing Factors */}
          <div className="mb-8">
            <h2 
              className="text-2xl font-bold mb-6 text-center" 
              style={{ color: '#1B4332', fontFamily: 'Noto Sans Tamil, sans-serif' }}
            >
              உங்கள் மதிப்பெண்ணை அதிகரித்தவை
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FactorCard 
                icon={TrendingUp} 
                tamil="நிலையான வருமானம்" 
                english="Stable Income"
                color="#27AE60"
              />
              <FactorCard 
                icon={Users} 
                tamil="குழு உறுப்பினர்" 
                english="Group Membership"
                color="#2D6A4F"
              />
              <FactorCard 
                icon={Wallet} 
                tamil="நிதி வரலாறு" 
                english="Financial History"
                color="#D4A017"
              />
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
            <button
              onClick={() => navigate('/schemes', { state: { scoreData } })}
              className="px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
              style={{ 
                backgroundColor: '#2D6A4F', 
                color: '#FAF7F0',
                fontFamily: 'Noto Sans Tamil, sans-serif'
              }}
            >
              திட்டங்களை பார்க்கவும் →
            </button>
            <button
              onClick={() => navigate('/questions')}
              className="px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
              style={{ 
                backgroundColor: '#D4A017', 
                color: '#1B4332',
                fontFamily: 'Noto Sans Tamil, sans-serif'
              }}
            >
              மீண்டும் முயற்சி
            </button>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default CreditScore;
