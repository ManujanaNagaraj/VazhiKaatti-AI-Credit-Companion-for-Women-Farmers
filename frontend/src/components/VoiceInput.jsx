import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { motion } from 'framer-motion';

const VoiceInput = ({ onTranscript, placeholder = "உங்கள் பதிலை சொல்லுங்கள்..." }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    // Initialize Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'ta-IN'; // Tamil language
      
      recognitionInstance.onresult = (event) => {
        const result = event.results[0][0].transcript;
        setTranscript(result);
        onTranscript(result);
        setIsListening(false);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, [onTranscript]);

  const toggleListening = () => {
    if (!recognition) {
      alert('Voice recognition not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const handleManualInput = (e) => {
    const value = e.target.value;
    setTranscript(value);
    onTranscript(value);
  };

  return (
    <div className="w-full">
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
          கேட்கிறேன்...
        </p>
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
    </div>
  );
};

export default VoiceInput;
