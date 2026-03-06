import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Award, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import ScoreGauge from '../components/ScoreGauge';
import TamilText from '../components/TamilText';
import AnimatedPage from '../components/AnimatedPage';
import axios from 'axios';

const CreditScore = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(null);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculateScore();
  }, []);

  const calculateScore = async () => {
    try {
      const assessmentData = JSON.parse(localStorage.getItem('assessmentData') || '{}');
      
      // In production, call the backend API
      // const response = await axios.post('http://localhost:8000/api/calculate-credit-score', {
      //   farmer_id: 'TEMP_ID',
      //   answers: assessmentData
      // });
      
      // For demo, calculate locally
      const calculatedScore = calculateLocalScore(assessmentData);
      const scoreCategory = getCategory(calculatedScore);
      
      setScore(calculatedScore);
      setCategory(scoreCategory);
      setLoading(false);
      
      // Save for later use
      localStorage.setItem('creditScore', calculatedScore.toString());
    } catch (error) {
      console.error('Error calculating score:', error);
      setLoading(false);
    }
  };

  const calculateLocalScore = (data) => {
    let baseScore = 500;
    
    // Land size factor
    const landSize = parseFloat(data.landSize) || 0;
    baseScore += Math.min(landSize * 20, 100);
    
    // Income factor
    const income = parseFloat(data.annualIncome) || 0;
    baseScore += Math.min(income / 10000, 150);
    
    // Education factor
    const educationScores = {
      'none': 0,
      'primary': 20,
      'middle': 40,
      'high_school': 60,
      'college': 80
    };
    baseScore += educationScores[data.educationLevel] || 0;
    
    // Loan history factor
    const loanScores = {
      'none': 0,
      'poor': 10,
      'fair': 20,
      'good': 40,
      'excellent': 60
    };
    baseScore += loanScores[data.loan_history] || 0;
    
    // Group membership
    if (data.group_membership === '1') {
      baseScore += 40;
    }
    
    // Years farming
    const years = parseInt(data.years_farming) || 0;
    baseScore += Math.min(years * 2, 30);
    
    // Savings
    const savings = parseFloat(data.savings_amount) || 0;
    baseScore += Math.min(savings / 5000, 50);
    
    return Math.max(300, Math.min(900, Math.round(baseScore)));
  };

  const getCategory = (score) => {
    if (score >= 750) return 'Excellent';
    if (score >= 650) return 'Good';
    if (score >= 550) return 'Fair';
    return 'Needs Improvement';
  };

  const getCategoryColor = () => {
    if (score >= 750) return 'text-green-600';
    if (score >= 650) return 'text-blue-600';
    if (score >= 550) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getCategoryIcon = () => {
    if (score >= 750) return <Award className="h-12 w-12 text-green-600" />;
    if (score >= 650) return <CheckCircle className="h-12 w-12 text-blue-600" />;
    if (score >= 550) return <TrendingUp className="h-12 w-12 text-yellow-600" />;
    return <AlertTriangle className="h-12 w-12 text-orange-600" />;
  };

  const getRecommendations = () => {
    const recommendations = [];
    
    if (score < 650) {
      recommendations.push({
        title: 'Join a Self-Help Group',
        titleTamil: 'சுய உதவி குழுவில் சேரவும்',
        description: 'SHG membership can improve your creditworthiness and access to schemes'
      });
    }
    
    if (score < 700) {
      recommendations.push({
        title: 'Maintain Loan Repayment',
        titleTamil: 'கடன் திருப்பிச் செலுத்துதலை பராமரிக்கவும்',
        description: 'Timely loan repayments significantly improve your credit score'
      });
    }
    
    recommendations.push({
      title: 'Regular Savings',
      titleTamil: 'வழக்கமான சேமிப்பு',
      description: 'Building savings demonstrates financial discipline'
    });
    
    return recommendations;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700">Calculating your credit score...</p>
          <TamilText text="உங்கள் கடன் மதிப்பெண்ணைக் கணக்கிடுகிறது..." className="text-gray-600" />
        </div>
      </div>
    );
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Credit Score</h1>
          <TamilText text="உங்கள் கடன் மதிப்பெண்" className="text-xl text-gray-600" />
        </div>

        {/* Score Display */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="text-center mb-8">
            <ScoreGauge score={score} />
            
            <div className="mt-8 flex items-center justify-center space-x-3">
              {getCategoryIcon()}
              <div>
                <h2 className={`text-3xl font-bold ${getCategoryColor()}`}>
                  {category}
                </h2>
                <TamilText 
                  text={category === 'Excellent' ? 'சிறந்த' : 
                        category === 'Good' ? 'நல்ல' : 
                        category === 'Fair' ? 'நியாயமான' : 'மேம்பாடு தேவை'} 
                  className="text-gray-600"
                />
              </div>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Range Guide</h3>
            <div className="space-y-2">
              <ScoreRange label="750-900: Excellent" color="bg-green-500" active={score >= 750} />
              <ScoreRange label="650-749: Good" color="bg-blue-500" active={score >= 650 && score < 750} />
              <ScoreRange label="550-649: Fair" color="bg-yellow-500" active={score >= 550 && score < 650} />
              <ScoreRange label="300-549: Needs Improvement" color="bg-orange-500" active={score < 550} />
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recommendations</h3>
          <TamilText text="பரிந்துரைகள்" className="text-gray-600 mb-6" />
          
          <div className="space-y-4">
            {getRecommendations().map((rec, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                  <TamilText text={rec.titleTamil} className="text-sm text-gray-600 mb-1" />
                  <p className="text-sm text-gray-700">{rec.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl shadow-xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-2">Ready to Find Schemes?</h3>
          <TamilText text="திட்டங்களைக் கண்டறிய தயாரா?" className="text-green-100 mb-6" />
          <p className="mb-6">
            Based on your credit score, we'll match you with suitable government schemes and loan programs.
          </p>
          <button
            onClick={() => navigate('/schemes')}
            className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 flex items-center space-x-2 transform hover:scale-105 transition-all"
          >
            <span>View Matching Schemes</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ScoreRange = ({ label, color, active }) => {
  return (
    <div className="flex items-center space-x-3">
      <div className={`w-4 h-4 rounded-full ${color} ${active ? 'ring-2 ring-offset-2 ring-gray-400' : 'opacity-30'}`} />
      <span className={`text-sm ${active ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
        {label}
      </span>
    </div>
  );
};

export default CreditScore;
