import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedPage from '../components/AnimatedPage';

const OfficerDashboard = () => {
  const navigate = useNavigate();

  return (
    <AnimatedPage>
      <div className="min-h-screen" style={{ backgroundColor: '#0F1B2D' }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center mb-8" style={{ color: '#D4A017' }}>
            VazhiKaatti — அதிகாரி போர்டல்
          </h1>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default OfficerDashboard;
