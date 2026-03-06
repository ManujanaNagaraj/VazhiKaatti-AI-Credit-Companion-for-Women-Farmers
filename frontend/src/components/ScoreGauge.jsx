import React from 'react';

const ScoreGauge = ({ score }) => {
  // Calculate the angle for the gauge (score ranges from 300 to 900)
  const minScore = 300;
  const maxScore = 900;
  const range = maxScore - minScore;
  const normalizedScore = ((score - minScore) / range) * 100;
  
  // Convert to angle (180 degrees semicircle)
  const angle = (normalizedScore / 100) * 180 - 90;
  
  const getColor = () => {
    if (score >= 750) return '#10b981'; // green
    if (score >= 650) return '#3b82f6'; // blue
    if (score >= 550) return '#f59e0b'; // yellow
    return '#f97316'; // orange
  };

  return (
    <div className="relative w-64 h-32 mx-auto">
      {/* Background Arc */}
      <svg className="w-full h-full" viewBox="0 0 200 100">
        {/* Background segments */}
        <path
          d="M 20 90 A 80 80 0 0 1 180 90"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="20"
          strokeLinecap="round"
        />
        
        {/* Score arc */}
        <path
          d="M 20 90 A 80 80 0 0 1 180 90"
          fill="none"
          stroke={getColor()}
          strokeWidth="20"
          strokeLinecap="round"
          strokeDasharray={`${normalizedScore * 2.51} 251`}
          className="transition-all duration-1000 ease-out"
        />
        
        {/* Needle */}
        <line
          x1="100"
          y1="90"
          x2="100"
          y2="30"
          stroke={getColor()}
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${angle} 100 90)`}
          className="transition-all duration-1000 ease-out"
        />
        
        {/* Center circle */}
        <circle cx="100" cy="90" r="8" fill={getColor()} />
        <circle cx="100" cy="90" r="4" fill="white" />
      </svg>
      
      {/* Score display */}
      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-5xl font-bold" style={{ color: getColor() }}>
          {score}
        </div>
      </div>
      
      {/* Score labels */}
      <div className="absolute bottom-0 left-0 text-xs text-gray-500">300</div>
      <div className="absolute bottom-0 right-0 text-xs text-gray-500">900</div>
      
      {/* Color legend */}
      <div className="mt-8 flex justify-center space-x-4 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span className="text-gray-600">300-549</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span className="text-gray-600">550-649</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-gray-600">650-749</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-gray-600">750-900</span>
        </div>
      </div>
    </div>
  );
};

export default ScoreGauge;
