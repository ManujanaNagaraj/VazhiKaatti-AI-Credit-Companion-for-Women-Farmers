import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, CheckCircle, Loader2 } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import axios from 'axios';

const FarmerProfile = () => {
  const navigate = useNavigate();
  const [farmerData, setFarmerData] = useState(null);
  const [landRecords, setLandRecords] = useState(null);
  const [govtSchemes, setGovtSchemes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchingLand, setFetchingLand] = useState(false);

  useEffect(() => {
    // Load farmer data from localStorage
    const storedData = localStorage.getItem('farmerData');
    if (storedData) {
      setFarmerData(JSON.parse(storedData));
      
      // Fetch land records from API
      fetchLandRecords();
      
      // Set mock government schemes data
      setGovtSchemes({
        pm_kisan: true,
        shg_membership: true
      });
    }
    setLoading(false);
  }, []);

  const fetchLandRecords = async () => {
    setFetchingLand(true);
    try {
      const response = await axios.post('http://localhost:8000/fetch-land-records', {
        survey_number: 'TN/123/456' // Mock survey number
      });
      setLandRecords(response.data);
    } catch (error) {
      console.error('Error fetching land records:', error);
      // Set mock data if API fails
      setLandRecords({
        land_area: '2.5 acres',
        crop_type: 'Rice',
        patta_number: 'PATTA-2024-001'
      });
    } finally {
      setFetchingLand(false);
    }
  };

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

          {/* Card 1 - Identity Information */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold" style={{ color: '#1B4332' }}>
                Identity Information
              </h3>
              <div className="flex items-center space-x-1" style={{ color: '#2D6A4F' }}>
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-semibold">✓ Verified</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border-l-4 pl-4" style={{ borderColor: '#2D6A4F' }}>
                <p className="text-sm" style={{ color: '#6B4226' }}>Name / பெயர்</p>
                <p className="text-lg font-semibold" style={{ color: '#1B4332' }}>
                  {farmerData.name || 'Not Available'}
                </p>
              </div>
              
              <div className="border-l-4 pl-4" style={{ borderColor: '#2D6A4F' }}>
                <p className="text-sm" style={{ color: '#6B4226' }}>Age / வயது</p>
                <p className="text-lg font-semibold" style={{ color: '#1B4332' }}>
                  {farmerData.age || 'Not Available'} years
                </p>
              </div>
              
              <div className="border-l-4 pl-4" style={{ borderColor: '#2D6A4F' }}>
                <p className="text-sm" style={{ color: '#6B4226' }}>Village / கிராமம்</p>
                <p className="text-lg font-semibold" style={{ color: '#1B4332' }}>
                  {farmerData.village || 'Not Available'}
                </p>
              </div>
              
              <div className="border-l-4 pl-4" style={{ borderColor: '#2D6A4F' }}>
                <p className="text-sm" style={{ color: '#6B4226' }}>District / மாவட்டம்</p>
                <p className="text-lg font-semibold" style={{ color: '#1B4332' }}>
                  {farmerData.district || 'Not Available'}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 - Land Records */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold" style={{ color: '#1B4332' }}>
                Land Records / நில பதிவுகள்
              </h3>
              {fetchingLand ? (
                <Loader2 className="h-5 w-5 animate-spin" style={{ color: '#2D6A4F' }} />
              ) : (
                <div className="flex items-center space-x-1" style={{ color: '#2D6A4F' }}>
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-semibold">✓ Verified</span>
                </div>
              )}
            </div>
            
            {landRecords ? (
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border-l-4 pl-4" style={{ borderColor: '#D4A017' }}>
                  <p className="text-sm" style={{ color: '#6B4226' }}>Land Area / நில பரப்பு</p>
                  <p className="text-lg font-semibold" style={{ color: '#1B4332' }}>
                    {landRecords.land_area || 'Not Available'}
                  </p>
                </div>
                
                <div className="border-l-4 pl-4" style={{ borderColor: '#D4A017' }}>
                  <p className="text-sm" style={{ color: '#6B4226' }}>Crop Type / பயிர் வகை</p>
                  <p className="text-lg font-semibold" style={{ color: '#1B4332' }}>
                    {landRecords.crop_type || 'Not Available'}
                  </p>
                </div>
                
                <div className="border-l-4 pl-4" style={{ borderColor: '#D4A017' }}>
                  <p className="text-sm" style={{ color: '#6B4226' }}>Patta Number / பட்டா எண்</p>
                  <p className="text-lg font-semibold" style={{ color: '#1B4332' }}>
                    {landRecords.patta_number || 'Not Available'}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-center" style={{ color: '#6B4226' }}>Loading land records...</p>
            )}
          </div>

          {/* Card 3 - Government Schemes */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold" style={{ color: '#1B4332' }}>
                Government Schemes / அரசு திட்டங்கள்
              </h3>
              <div className="flex items-center space-x-1" style={{ color: '#2D6A4F' }}>
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-semibold">✓ Verified</span>
              </div>
            </div>
            
            {govtSchemes ? (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border-l-4 pl-4" style={{ borderColor: '#D4A017' }}>
                  <p className="text-sm" style={{ color: '#6B4226' }}>PM-KISAN Status</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div 
                      className="px-3 py-1 rounded-full text-sm font-semibold"
                      style={{ 
                        backgroundColor: govtSchemes.pm_kisan ? '#D4F1DD' : '#FFE5E5',
                        color: govtSchemes.pm_kisan ? '#2D6A4F' : '#C0392B'
                      }}
                    >
                      {govtSchemes.pm_kisan ? '✓ Enrolled' : '✗ Not Enrolled'}
                    </div>
                  </div>
                </div>
                
                <div className="border-l-4 pl-4" style={{ borderColor: '#D4A017' }}>
                  <p className="text-sm" style={{ color: '#6B4226' }}>SHG Membership / SHG உறுப்பினர்</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div 
                      className="px-3 py-1 rounded-full text-sm font-semibold"
                      style={{ 
                        backgroundColor: govtSchemes.shg_membership ? '#D4F1DD' : '#FFE5E5',
                        color: govtSchemes.shg_membership ? '#2D6A4F' : '#C0392B'
                      }}
                    >
                      {govtSchemes.shg_membership ? '✓ Active Member' : '✗ Not a Member'}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center" style={{ color: '#6B4226' }}>Loading schemes data...</p>
            )}
          </div>

          {/* Placeholder for actions */}
          <div className="text-center" style={{ color: '#6B4226' }}>
            Action buttons coming soon...
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default FarmerProfile;
