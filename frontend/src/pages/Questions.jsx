import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import VoiceInput from '../components/VoiceInput';
import AnimatedPage from '../components/AnimatedPage';
import axios from 'axios';

const Questions = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const questions = [
    {
      id: 'years_farming',
      tamil: 'நீங்கள் எத்தனை ஆண்டுகளாக விவசாயம் செய்கிறீர்கள்?',
      english: 'How many years farming?'
    },
    {
      id: 'annual_income',
      tamil: 'உங்கள் ஆண்டு வருமானம் தோராயமாக எவ்வளவு?',
      english: 'Approximate annual income?'
    },
    {
      id: 'existing_loans',
      tamil: 'நீங்கள் ஏதாவது கடன் வாங்கியிருக்கிறீர்களா?',
      english: 'Do you have existing loans?'
    },
    {
      id: 'shg_member',
      tamil: 'நீங்கள் சுய உதவிக் குழுவில் உறுப்பினரா?',
      english: 'Are you an SHG member?'
    },
    {
      id: 'bank_account',
      tamil: 'உங்களிடம் வங்கி கணக்கு இருக்கிறதா?',
      english: 'Do you have a bank account?'
    }
  ];

  const handleTranscript = (text) => {
    setCurrentAnswer(text);
  };

  const handleNext = () => {
    if (!currentAnswer.trim()) {
      alert('Please provide an answer / தயவுசெய்து பதிலளிக்கவும்');
      return;
    }

    // Save current answer
    const newAnswers = {
      ...answers,
      [questions[currentQuestion].id]: currentAnswer
    };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      // Move to next question
      setCurrentQuestion(currentQuestion + 1);
      setCurrentAnswer('');
    } else {
      // All questions answered, prepare data for API
      submitToAPI(newAnswers);
    }
  };

  const submitToAPI = async (finalAnswers) => {
    setSubmitting(true);
    try {
      // Get profile data from localStorage
      const name = localStorage.getItem('farmer_name') || '';
      const age = parseInt(localStorage.getItem('farmer_age') || '0');
      const village = localStorage.getItem('farmer_village') || '';
      const district = localStorage.getItem('farmer_district') || '';

      // Prepare mock features for API (these should be parsed from answers in production)
      const features = {
        years_of_farming: parseFloat(finalAnswers.years_farming) || 5,
        crop_type: 0, // Rice (0=Rice, 1=Vegetables, 2=Fruits, 3=Mixed)
        annual_income_inr: parseFloat(finalAnswers.annual_income) || 50000,
        land_size_acres: 2.5,
        education_level: 1, // Primary
        family_size: 4,
        livestock_owned: 2,
        loan_history: 1, // Good
        savings_amount: 10000,
        group_membership: finalAnswers.shg_member?.toLowerCase() === 'yes' || finalAnswers.shg_member === 'ஆம்' ? 1 : 0,
        irrigation_access: 1, // Well
        market_access: 1 // Local market
      };

      // Call predict-score API
      const response = await axios.post('http://localhost:8000/predict-score', features);
      
      // Save score data and answers to localStorage
      localStorage.setItem('creditScore', JSON.stringify(response.data));
      localStorage.setItem('questionnaireAnswers', JSON.stringify(finalAnswers));
      
      // Navigate to score page
      navigate('/score', { state: { scoreData: response.data } });
    } catch (error) {
      console.error('Error submitting answers:', error);
      alert('Error calculating score. Please try again. / மதிப்பெண் கணக்கிடுவதில் பிழை. மீண்டும் முயற்சிக்கவும்.');
    } finally {
      setSubmitting(false);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <AnimatedPage>
      <div 
        className="min-h-screen py-8 px-4" 
        style={{ background: 'linear-gradient(135deg, #1B4332 0%, #0d2418 100%)' }}
      >
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold" style={{ color: '#D4A017' }}>
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm font-semibold" style={{ color: '#D4A017' }}>
                {currentQuestion + 1}/{questions.length}
              </span>
            </div>
            <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#2D6A4F' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: '#D4A017' }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Question Card */}
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl p-8"
          >
            {/* Question Text */}
            <h2 
              className="text-3xl font-bold mb-2 text-center"
              style={{ color: '#1B4332', fontFamily: 'Noto Sans Tamil, sans-serif' }}
            >
              {questions[currentQuestion].tamil}
            </h2>
            <p className="text-center text-lg mb-8" style={{ color: '#6B4226' }}>
              {questions[currentQuestion].english}
            </p>

            {/* Voice Input Component */}
            <VoiceInput 
              onTranscript={handleTranscript}
              placeholder="உங்கள் பதிலை சொல்லுங்கள்..."
            />

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={submitting}
              className="w-full mt-8 py-4 rounded-lg font-bold text-xl transition-all hover:scale-105 flex items-center justify-center space-x-2"
              style={{ 
                backgroundColor: submitting ? '#6B4226' : '#D4A017', 
                color: '#FAF7F0',
                fontFamily: 'Noto Sans Tamil, sans-serif',
                opacity: submitting ? 0.7 : 1
              }}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>சமர்ப்பிக்கிறது...</span>
                </>
              ) : (
                <span>{currentQuestion < questions.length - 1 ? 'அடுத்தது →' : 'முடி →'}</span>
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Questions;
