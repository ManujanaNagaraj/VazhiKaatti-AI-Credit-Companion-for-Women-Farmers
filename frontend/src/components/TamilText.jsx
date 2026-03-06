import React from 'react';

const TamilText = ({ text, className = '' }) => {
  return (
    <p className={`tamil-text ${className}`}>
      {text}
    </p>
  );
};

export default TamilText;
