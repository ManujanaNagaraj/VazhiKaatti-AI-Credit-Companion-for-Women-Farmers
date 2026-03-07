import React, { useState, useEffect } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const VoiceInput = ({ onTranscript, placeholder = "உங்கள் பதிலை சொல்லுங்கள்..." }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('ta-IN'); // Default to Tamil

  useEffect(() => {
    // Initialize Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true; // Enable interim results
      recognitionInstance.maxAlternatives = 1;
      recognitionInstance.lang = language;
      
      recognitionInstance.onstart = () => {
        console.log('Voice recognition started');
        setError('');
      };
      
      recognitionInstance.onresult = (event) => {
        console.log('Speech recognized:', event.results);
        const current = event.resultIndex;
        const transcriptResult = event.results[current][0].transcript;
        
        setTranscript(transcriptResult);
        onTranscript(transcriptResult);
        
        // If it's a final result, stop listening
        if (event.results[current].isFinal) {
          setIsListening(false);
        }
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        
        let errorMessage = '';
        switch(event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please try again. / பேச்சு கண்டறியப்படவில்லை.';
            break;
          case 'audio-capture':
            errorMessage = 'Microphone not found. / ஒலிவாங்கி இல்லை.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone permission denied. Please allow microphone access. / ஒலிவாங்கி அனுமதி மறுக்கப்பட்டது.';
            break;
          case 'network':
            errorMessage = 'Network error. Please check your connection. / இணைய பிழை.';
            break;
          default:
            errorMessage = `Error: ${event.error}`;
        }
        
        setError(errorMessage);
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        console.log('Voice recognition ended');
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    } else {
      setError('Voice recognition not supported in this browser. Please use Chrome or Edge.');
    }
  }, [language]);

  const toggleListening = () => {
    if (!recognition) {
      setError('Voice recognition not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      try {
        // Update language before starting
        recognition.lang = language;
        recognition.start();
        setIsListening(true);
        setError('');
      } catch (err) {
        console.error('Error starting recognition:', err);
        setError('Could not start voice recognition. Please try again. / குரல் அங்கீகாரம் தொடங்க முடியவில்லை.');
        setIsListening(false);
      }
    }
  };

  const handleManualInput = (e) => {
    const value = e.target.value;
    setTranscript(value);
    onTranscript(value);
  };

  const toggleLanguage = () => {
    const newLang = language === 'ta-IN' ? 'en-IN' : 'ta-IN';
    setLanguage(newLang);
  };

  return (
    <div className="w-full">
      {/* Language Toggle */}
      <div className="flex justify-center mb-4">
        <button
          onClick={toggleLanguage}
          className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
          style={{
            backgroundColor: language === 'ta-IN' ? '#2D6A4F' : '#D4A017',
            color: '#FAF7F0'
          }}
        >
          {language === 'ta-IN' ? 'தமிழ் (Tamil)' : 'English'}
        </button>
      </div>

      {/* Mic Button */}
      <div className="flex justify-center mb-4">
        <motion.button
          onClick={toggleListening}
          className="relative rounded-full flex items-center justify-center"
          style={{
            width: '80px',
            height: '80px',
            backgroundColor: isListening ? '#2D6A4F' : '#D4A017',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}
          whileTap={{ scale: 0.95 }}
          animate={isListening ? {
            scale: [1, 1.1, 1],
            transition: { duration: 1, repeat: Infinity }
          } : {}}
        >
          {/* Pulsing Ring when Recording */}
          {isListening && (
            <motion.div
              className="absolute rounded-full"
              style={{
                width: '100px',
                height: '100px',
                border: '3px solid #2D6A4F',
                top: '-10px',
                left: '-10px'
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.7, 0, 0.7]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity
              }}
            />
          )}
          
          {isListening ? (
            <Mic className="h-10 w-10" style={{ color: '#FAF7F0' }} />
          ) : (
            <MicOff className="h-10 w-10" style={{ color: '#FAF7F0' }} />
          )}
        </motion.button>
      </div>

      {/* Listening Status */}
      {isListening && (
        <p 
          className="text-center mb-4 font-semibold animate-pulse"
          style={{ color: '#2D6A4F', fontFamily: 'Noto Sans Tamil, sans-serif' }}
        >
          {language === 'ta-IN' ? 'கேட்கிறேன்...' : 'Listening...'}
        </p>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 rounded-lg flex items-start gap-2" style={{ backgroundColor: '#FFE5E5' }}>
          <AlertCircle className="h-5 w-5 flex-shrink-0" style={{ color: '#C0392B' }} />
          <p className="text-sm" style={{ color: '#C0392B', fontFamily: 'Noto Sans Tamil, sans-serif' }}>
            {error}
          </p>
        </div>
      )}

      {/* Recognized Text */}
      {transcript && (
        <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: '#D4F1DD' }}>
          <p className="text-sm mb-1" style={{ color: '#6B4226' }}>
            Recognized / அங்கீகரிக்கப்பட்டது:
          </p>
          <p 
            className="text-lg font-semibold" 
            style={{ color: '#1B4332', fontFamily: 'Noto Sans Tamil, sans-serif' }}
          >
            {transcript}
          </p>
        </div>
      )}

      {/* Fallback Manual Input */}
      <div>
        <label className="block text-sm mb-2" style={{ color: '#6B4226' }}>
          Or type manually / அல்லது தட்டச்சு செய்யுங்கள்:
        </label>
        <input
          type="text"
          value={transcript}
          onChange={handleManualInput}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-lg border-2"
          style={{
            borderColor: '#2D6A4F',
            backgroundColor: 'white',
            fontFamily: 'Noto Sans Tamil, sans-serif'
          }}
        />
      </div>

      {/* Instructions */}
      <div className="mt-3 text-xs text-center" style={{ color: '#6B4226' }}>
        <p>💡 Click the microphone and speak clearly</p>
        <p style={{ fontFamily: 'Noto Sans Tamil, sans-serif' }}>
          ஒலிவாங்கியை கிளிக் செய்து தெளிவாக பேசுங்கள்
        </p>
      </div>
    </div>
  );
};

export default VoiceInput;
