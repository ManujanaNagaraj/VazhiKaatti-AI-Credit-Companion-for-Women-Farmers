import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Loader2 } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import axios from 'axios';

const FarmerLogin = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Aadhaar, 2: OTP
  const [aadhaar, setAadhaar] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Format Aadhaar number as XXXX XXXX XXXX
  const formatAadhaar = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 4) return numbers;
    if (numbers.length <= 8) return `${numbers.slice(0, 4)} ${numbers.slice(4)}`;
    return `${numbers.slice(0, 4)} ${numbers.slice(4, 8)} ${numbers.slice(8, 12)}`;
  };

  const handleAadhaarChange = (e) => {
    const value = e.target.value;
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 12) {
      setAadhaar(formatAadhaar(value));
      setError('');
    }
  };

  const handleSendOTP = async () => {
    const aadhaarNumber = aadhaar.replace(/\s/g, '');
    
    if (aadhaarNumber.length !== 12) {
      setError('Aadhaar must be 12 digits / Aadhaar 12 இலக்கமாக இருக்க வேண்டும்');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate API call - in production call real API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep(2);
      setTimeout(() => otpRefs[0].current?.focus(), 100);
    } catch (err) {
      setError('Failed to send OTP / OTP அனுப்புவதில் தோல்வி');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take last digit
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 3) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join('');
    
    if (otpValue.length !== 4) {
      setError('Please enter complete OTP / முழு OTP ஐ உள்ளிடவும்');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const aadhaarNumber = aadhaar.replace(/\s/g, '');
      
      // Call backend API
      const response = await axios.post('http://localhost:8000/verify-aadhaar', {
        aadhaar_number: aadhaarNumber,
        otp: otpValue
      });

      // Save farmer data to localStorage
      localStorage.setItem('farmerData', JSON.stringify(response.data));
      localStorage.setItem('aadhaarVerified', 'true');
      
      // Navigate to profile
      navigate('/profile');
    } catch (err) {
      console.error('Verification error:', err);
      setError(err.response?.data?.detail || 'Verification failed / சரிபார்ப்பு தோல்வி');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen flex items-center justify-center p-4" 
           style={{ background: 'linear-gradient(135deg, #1B4332 0%, #0d2418 100%)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2" style={{ color: '#D4A017' }}>
              VazhiKaatti
            </h1>
            <p className="text-xl" style={{ color: '#FAF7F0', fontFamily: 'Noto Sans Tamil, sans-serif' }}>
              வழிகாட்டி
            </p>
          </div>

          {/* Login Card */}
          <div 
            className="rounded-3xl shadow-2xl p-8"
            style={{ 
              backgroundColor: '#FAF7F0',
              border: '3px solid #2D6A4F'
            }}
          >
            {/* Step 1: Aadhaar Entry */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-6">
                  <Shield className="h-16 w-16 mx-auto mb-3" style={{ color: '#2D6A4F' }} />
                  <h2 className="text-2xl font-semibold mb-2" style={{ color: '#1B4332' }}>
                    Aadhaar Login
                  </h2>
                  <p className="text-gray-600" style={{ fontFamily: 'Noto Sans Tamil, sans-serif' }}>
                    Aadhaar உள்நுழைவு
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#6B4226' }}>
                      Aadhaar Number / Aadhaar எண்
                    </label>
                    <input
                      type="text"
                      value={aadhaar}
                      onChange={handleAadhaarChange}
                      placeholder="XXXX XXXX XXXX"
                      className="w-full px-4 py-3 rounded-lg border-2 text-lg tracking-wider text-center"
                      style={{
                        borderColor: '#2D6A4F',
                        backgroundColor: 'white',
                        outline: 'none'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#D4A017'}
                      onBlur={(e) => e.target.style.borderColor = '#2D6A4F'}
                      maxLength={14} // 12 digits + 2 spaces
                    />
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-center"
                      style={{ color: '#C0392B' }}
                    >
                      {error}
                    </motion.div>
                  )}

                  <button
                    onClick={handleSendOTP}
                    disabled={loading}
                    className="w-full py-3 rounded-lg font-semibold text-lg flex items-center justify-center space-x-2 transition-all"
                    style={{
                      backgroundColor: '#D4A017',
                      color: '#FAF7F0',
                      opacity: loading ? 0.7 : 1
                    }}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <span style={{ fontFamily: 'Noto Sans Tamil, sans-serif' }}>
                        OTP அனுப்பு
                      </span>
                    )}
                  </button>

                  <div className="text-center text-sm" style={{ color: '#6B4226' }}>
                    <Shield className="h-4 w-4 inline mr-1" />
                    <span style={{ fontFamily: 'Noto Sans Tamil, sans-serif' }}>
                      உங்கள் Aadhaar தகவல் பாதுகாப்பானது
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: OTP Entry */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold mb-2" style={{ color: '#1B4332' }}>
                    Enter OTP
                  </h2>
                  <p className="text-gray-600 mb-4" style={{ fontFamily: 'Noto Sans Tamil, sans-serif' }}>
                    OTP உள்ளிடவும்
                  </p>
                  <p className="text-sm" style={{ color: '#6B4226' }}>
                    OTP sent to Aadhaar registered mobile
                  </p>
                </div>

                <div className="space-y-6">
                  {/* OTP Input Boxes */}
                  <div className="flex justify-center space-x-3">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={otpRefs[index]}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-14 h-14 text-center text-2xl font-bold rounded-lg border-2"
                        style={{
                          borderColor: digit ? '#2D6A4F' : '#ccc',
                          backgroundColor: 'white',
                          outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#D4A017'}
                        onBlur={(e) => e.target.style.borderColor = digit ? '#2D6A4F' : '#ccc'}
                      />
                    ))}
                  </div>

                  <div className="text-center text-sm" style={{ color: '#E67E22' }}>
                    💡 Demo OTP: 1234
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-center"
                      style={{ color: '#C0392B' }}
                    >
                      {error}
                    </motion.div>
                  )}

                  <button
                    onClick={handleVerifyOtp}
                    disabled={loading}
                    className="w-full py-3 rounded-lg font-semibold text-lg flex items-center justify-center space-x-2 transition-all"
                    style={{
                      backgroundColor: '#2D6A4F',
                      color: '#FAF7F0',
                      opacity: loading ? 0.7 : 1
                    }}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <span style={{ fontFamily: 'Noto Sans Tamil, sans-serif' }}>
                        சரிபார்
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setStep(1);
                      setOtp(['', '', '', '']);
                      setError('');
                    }}
                    className="w-full text-sm"
                    style={{ color: '#6B4226' }}
                  >
                    ← Change Aadhaar Number
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Back to Home */}
          <button
            onClick={() => navigate('/')}
            className="w-full mt-4 text-center py-2"
            style={{ color: '#FAF7F0' }}
          >
            ← Back to Home / முகப்புக்கு திரும்பு
          </button>
        </motion.div>
      </div>
    </AnimatedPage>
  );
};

export default FarmerLogin;
