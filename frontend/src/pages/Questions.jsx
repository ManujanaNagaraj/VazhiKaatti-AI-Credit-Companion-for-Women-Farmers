import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';
import VoiceInput from '../components/VoiceInput';
import TamilText from '../components/TamilText';
import AnimatedPage from '../components/AnimatedPage';

const Questions = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const questions = [
    {
      id: 'livestock_owned',
      question: 'How many livestock do you own?',
      questionTamil: 'உங்களிடம் எத்தனை கால்நடைகள் உள்ளன?',
      type: 'number',
      options: null
    },
    {
      id: 'years_farming',
      question: 'How many years have you been farming?',
      questionTamil: 'நீங்கள் எத்தனை ஆண்டுகளாக விவசாயம் செய்கிறீர்கள்?',
      type: 'number',
      options: null
    },
    {
      id: 'loan_history',
      question: 'What is your loan repayment history?',
      questionTamil: 'உங்கள் கடன் திருப்பிச் செலுத்தும் பதிவு என்ன?',
      type: 'select',
      options: [
        { value: 'none', label: 'No previous loans / முந்தைய கடன்கள் இல்லை' },
        { value: 'poor', label: 'Poor / மோசமான' },
        { value: 'fair', label: 'Fair / நியாயமான' },
        { value: 'good', label: 'Good / நல்ல' },
        { value: 'excellent', label: 'Excellent / சிறந்த' }
      ]
    },
    {
      id: 'savings_amount',
      question: 'How much do you have in savings? (₹)',
      questionTamil: 'உங்களிடம் எவ்வளவு சேமிப்பு உள்ளது? (₹)',
      type: 'number',
      options: null
    },
    {
      id: 'group_membership',
      question: 'Are you a member of any self-help group or cooperative?',
      questionTamil: 'நீங்கள் ஏதேனும் சுய உதவி குழு அல்லது கூட்டுறவு உறுப்பினரா?',
      type: 'select',
      options: [
        { value: '0', label: 'No / இல்லை' },
        { value: '1', label: 'Yes / ஆம்' }
      ]
    },
    {
      id: 'irrigation_access',
      question: 'Do you have access to irrigation?',
      questionTamil: 'உங்களுக்கு நீர்ப்பாசன வசதி உள்ளதா?',
      type: 'select',
      options: [
        { value: 'none', label: 'No irrigation / நீர்ப்பாசனம் இல்லை' },
        { value: 'rainfed', label: 'Rainfed only / மழை நீர் மட்டும்' },
        { value: 'well', label: 'Well / கிணறு' },
        { value: 'canal', label: 'Canal / கால்வாய்' },
        { value: 'drip', label: 'Drip/Sprinkler / துளி/தெளிப்பான்' }
      ]
    },
    {
      id: 'market_access',
      question: 'How do you sell your produce?',
      questionTamil: 'உங்கள் விளைபொருட்களை எவ்வாறு விற்கிறீர்கள்?',
      type: 'select',
      options: [
        { value: 'middleman', label: 'Through middleman / இடைத்தரகர் மூலம்' },
        { value: 'local_market', label: 'Local market / உள்ளூர் சந்தை' },
        { value: 'mandi', label: 'Mandi / மண்டி' },
        { value: 'direct', label: 'Direct to consumers / நேரடி வாடிக்கையாளர்கள்' }
      ]
    }
  ];

  const handleAnswer = (value) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: value
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Save answers and navigate to credit score
      const profileData = JSON.parse(localStorage.getItem('farmerProfile') || '{}');
      const completeData = { ...profileData, ...answers };
      localStorage.setItem('assessmentData', JSON.stringify(completeData));
      navigate('/score');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Credit Assessment</h1>
          <TamilText text="கடன் மதிப்பீடு" className="text-xl text-gray-600" />
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-start space-x-3 mb-6">
            <MessageCircle className="h-6 w-6 text-green-600 mt-1" />
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {currentQ.question}
              </h2>
              <TamilText text={currentQ.questionTamil} className="text-gray-600" />
            </div>
          </div>

          {/* Answer Input */}
          <div className="space-y-4">
            {currentQ.type === 'number' && (
              <input
                type="number"
                value={answers[currentQ.id] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                placeholder="Enter your answer"
                min="0"
              />
            )}

            {currentQ.type === 'select' && (
              <div className="space-y-2">
                {currentQ.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    className={`w-full px-4 py-3 rounded-lg border-2 text-left transition-all ${
                      answers[currentQ.id] === option.value
                        ? 'border-green-600 bg-green-50 text-green-900'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option.label}</span>
                      {answers[currentQ.id] === option.value && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Voice Input */}
          <div className="mt-6 pt-6 border-t">
            <VoiceInput 
              onTranscript={(text) => handleAnswer(text)}
              questionId={currentQ.id}
            />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous / முந்தைய
          </button>
          <button
            onClick={handleNext}
            disabled={!answers[currentQ.id]}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 flex items-center justify-center space-x-2"
          >
            <span>{currentQuestion === questions.length - 1 ? 'Calculate Score' : 'Next'}</span>
            {currentQuestion === questions.length - 1 ? (
              <AlertCircle className="h-5 w-5" />
            ) : (
              <span>→</span>
            )}
          </button>
        </div>
      </div>
    </div>
    </AnimatedPage>
  );
};

export default Questions;
