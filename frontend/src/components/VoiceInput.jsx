import React, { useState } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import TamilText from './TamilText';

const VoiceInput = ({ onTranscript, questionId }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');

  const startRecording = async () => {
    try {
      // Check if browser supports speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        setError('Speech recognition is not supported in your browser');
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'ta-IN'; // Tamil language
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecording(true);
        setError('');
      };

      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        onTranscript(text);
        setIsRecording(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError('Error recognizing speech. Please try again.');
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Error starting speech recognition:', err);
      setError('Could not start speech recognition');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const speakQuestion = () => {
    // Text-to-speech functionality
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(transcript || 'Ready to record');
      utterance.lang = 'ta-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Mic className="h-5 w-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Voice Input</span>
          <TamilText text="குரல் உள்ளீடு" className="text-xs text-gray-600" />
        </div>
        <button
          onClick={speakQuestion}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          title="Listen to question"
        >
          <Volume2 className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`flex-shrink-0 p-4 rounded-full transition-all ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'bg-green-600 hover:bg-green-700'
          } text-white shadow-lg`}
        >
          {isRecording ? (
            <MicOff className="h-6 w-6" />
          ) : (
            <Mic className="h-6 w-6" />
          )}
        </button>

        <div className="flex-1">
          {isRecording && (
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              <span className="text-sm text-gray-600">Listening...</span>
            </div>
          )}
          
          {transcript && !isRecording && (
            <div className="text-sm text-gray-700 bg-white p-2 rounded border border-gray-300">
              {transcript}
            </div>
          )}
          
          {!isRecording && !transcript && (
            <div className="text-sm text-gray-500">
              Click the microphone to record your answer in Tamil or English
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500">
        <TamilText text="தமிழ் அல்லது ஆங்கிலத்தில் பேசலாம்" />
      </div>
    </div>
  );
};

export default VoiceInput;
