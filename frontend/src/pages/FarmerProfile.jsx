import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Briefcase, Home, TrendingUp } from 'lucide-react';
import TamilText from '../components/TamilText';

const FarmerProfile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: '',
    age: '',
    village: '',
    district: '',
    landSize: '',
    cropType: '',
    annualIncome: '',
    educationLevel: '',
    familySize: ''
  });

  useEffect(() => {
    const savedData = localStorage.getItem('farmerData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setProfileData(prev => ({
        ...prev,
        name: parsed.name || '',
        village: parsed.village || ''
      }));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('farmerProfile', JSON.stringify(profileData));
    navigate('/questions');
  };

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Farmer Profile</h1>
          <TamilText text="விவசாயி விவரம்" className="text-xl text-gray-600" />
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-green-600" />
                Personal Information
              </h2>
              <TamilText text="தனிப்பட்ட தகவல்" className="text-sm text-gray-600 mb-4" />
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name / பெயர்
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age / வயது
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={profileData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                    min="18"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                Location / இடம்
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Village / கிராமம்
                  </label>
                  <input
                    type="text"
                    name="village"
                    value={profileData.village}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    District / மாவட்டம்
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={profileData.district}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Farming Details */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-purple-600" />
                Farming Details / விவசாய விவரங்கள்
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Land Size (acres) / நில அளவு
                  </label>
                  <input
                    type="number"
                    name="landSize"
                    value={profileData.landSize}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                    step="0.1"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Main Crop Type / முக்கிய பயிர்
                  </label>
                  <select
                    name="cropType"
                    value={profileData.cropType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select</option>
                    <option value="rice">Rice / நெல்</option>
                    <option value="wheat">Wheat / கோதுமை</option>
                    <option value="cotton">Cotton / பருத்தி</option>
                    <option value="sugarcane">Sugarcane / கரும்பு</option>
                    <option value="vegetables">Vegetables / காய்கறிகள்</option>
                    <option value="millets">Millets / சிறுதானியங்கள்</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Annual Income (₹) / ஆண்டு வருமானம்
                  </label>
                  <input
                    type="number"
                    name="annualIncome"
                    value={profileData.annualIncome}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Family & Education */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Home className="h-5 w-5 mr-2 text-orange-600" />
                Family & Education / குடும்பம் & கல்வி
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Education Level / கல்வி நிலை
                  </label>
                  <select
                    name="educationLevel"
                    value={profileData.educationLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select</option>
                    <option value="none">No Formal Education</option>
                    <option value="primary">Primary School</option>
                    <option value="middle">Middle School</option>
                    <option value="high_school">High School</option>
                    <option value="college">College</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Family Size / குடும்ப அளவு
                  </label>
                  <input
                    type="number"
                    name="familySize"
                    value={profileData.familySize}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                    min="1"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-lg flex items-center justify-center space-x-2 transform hover:scale-105 transition-all"
              >
                <span>Continue to Assessment</span>
                <TrendingUp className="h-5 w-5" />
              </button>
              <TamilText 
                text="மதிப்பீட்டிற்கு தொடரவும்" 
                className="text-center text-sm text-gray-600 mt-2"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FarmerProfile;
