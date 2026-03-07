import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'info', isVisible, onClose }) => {
  const icons = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <AlertCircle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />
  };

  const colors = {
    success: { bg: '#D4F1DD', border: '#2D6A4F', text: '#1B4332' },
    error: { bg: '#FFE5E5', border: '#C0392B', text: '#C0392B' },
    info: { bg: '#E3F2FD', border: '#1976D2', text: '#0D47A1' }
  };

  const color = colors[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -50, x: '-50%' }}
          className="fixed top-6 left-1/2 z-50 flex items-center space-x-3 px-6 py-4 rounded-lg shadow-2xl border-2"
          style={{
            backgroundColor: color.bg,
            borderColor: color.border,
            minWidth: '320px',
            maxWidth: '600px'
          }}
        >
          <div style={{ color: color.border }}>
            {icons[type]}
          </div>
          <p
            className="flex-1 font-semibold"
            style={{ 
              color: color.text,
              fontFamily: 'Noto Sans Tamil, sans-serif'
            }}
          >
            {message}
          </p>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-2 hover:opacity-70 transition-opacity"
              style={{ color: color.border }}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
