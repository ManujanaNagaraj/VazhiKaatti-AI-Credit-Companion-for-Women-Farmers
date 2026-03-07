import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

const HelpButton = ({ instructions }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = useRef(null);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const speakInstructions = () => {
    if (!synthRef.current || !instructions) return;

    if (isSpeaking) {
      // Stop speaking
      synthRef.current.cancel();
      setIsSpeaking(false);
    } else {
      // Start speaking
      const utterance = new SpeechSynthesisUtterance(instructions);
      utterance.lang = 'ta-IN'; // Tamil language
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1.0;

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      synthRef.current.speak(utterance);
      setIsSpeaking(true);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (synthRef.current && isSpeaking) {
        synthRef.current.cancel();
      }
    };
  }, [isSpeaking]);

  if (!('speechSynthesis' in window)) {
    return null; // Don't render if browser doesn't support speech synthesis
  }

  return (
    <motion.button
      onClick={speakInstructions}
      className="fixed bottom-24 left-6 z-40 rounded-full shadow-2xl flex items-center justify-center"
      style={{
        width: '60px',
        height: '60px',
        backgroundColor: isSpeaking ? '#C0392B' : '#1976D2',
        border: '3px solid #FAF7F0'
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      animate={!isSpeaking ? {
        boxShadow: [
          '0 0 0 0 rgba(25, 118, 210, 0.7)',
          '0 0 0 20px rgba(25, 118, 210, 0)',
        ],
      } : {}}
      transition={{
        boxShadow: {
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      }}
      title="உதவி - Tamil வழிகாட்டுதல்"
    >
      {isSpeaking ? (
        <VolumeX className="h-7 w-7" style={{ color: '#FAF7F0' }} />
      ) : (
        <Volume2 className="h-7 w-7" style={{ color: '#FAF7F0' }} />
      )}
    </motion.button>
  );
};

export default HelpButton;
