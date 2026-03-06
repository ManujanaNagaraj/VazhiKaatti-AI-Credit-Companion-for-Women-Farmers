import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';

const FarmerProfile = () => {
  const navigate = useNavigate();
  const [farmerData, setFarmerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load farmer data from localStorage
    const storedData = localStorage.getItem('farmerData');
    if (storedData) {
      setFarmerData(JSON.parse(storedData));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <AnimatedPage>
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF7F0' }}>
          <p style={{ color: '#1B4332' }}>Loading...</p>
        </div>
      </AnimatedPage>
    );
  }

  if (!farmerData) {
    return (
      <AnimatedPage>
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF7F0' }}>
          <div className="text-center">
            <p className="mb-4" style={{ color: '#1B4332' }}>No farmer data found</p>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 rounded-lg"
              style={{ backgroundColor: '#2D6A4F', color: '#FAF7F0' }}
            >
              Go to Login
            </button>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#FAF7F0' }}>
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <h1 className="text-3xl font-bold mb-8 text-center" style={{ color: '#1B4332' }}>
            Farmer Profile
          </h1>

          {/* Profile Header Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div className="flex flex-col items-center">
              {/* Photo Placeholder Circle */}
              <div 
                className="w-32 h-32 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: '#2D6A4F' }}
              >
                <User className="h-16 w-16" style={{ color: '#FAF7F0' }} />
              </div>
              
              {/* Name */}
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#1B4332' }}>
                {farmerData.name || 'Farmer Name'}
              </h2>
              
              {/* Age, Village, District */}
              <div className="text-center">
                <p className="text-lg mb-1" style={{ color: '#6B4226' }}>
                  Age: {farmerData.age || 'N/A'} years
                </p>
                <p className="text-lg mb-1" style={{ color: '#6B4226' }}>
                  Village: {farmerData.village || 'N/A'}
                </p>
                <p className="text-lg" style={{ color: '#6B4226' }}>
                  District: {farmerData.district || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Placeholder for info cards */}
          <div className="text-center" style={{ color: '#6B4226' }}>
            More information cards coming soon...
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default FarmerProfile;
