import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Phone, MapPin } from 'lucide-react';
import TamilText from '../components/TamilText';
import AnimatedPage from '../components/AnimatedPage';

const FarmerLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phoneNumber: '',
    name: '',
    village: ''
  });
  const [isNewUser, setIsNewUser] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Store farmer data and navigate
    localStorage.setItem('farmerData', JSON.stringify(formData));
    navigate('/profile');
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">VazhiKaatti</h1>
          <TamilText text="வழிகாட்டி" className="text-xl text-gray-600" />
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <UserCircle className="h-16 w-16 text-green-600 mx-auto mb-3" />
            <h2 className="text-2xl font-semibold text-gray-900">Farmer Login</h2>
            <TamilText text="விவசாயி உள்நுழைவு" className="text-gray-600" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number / தொலைபேசி எண்
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter 10-digit mobile number"
                  required
                  maxLength="10"
                />
              </div>
            </div>

            {/* New User Toggle */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="newUser"
                checked={isNewUser}
                onChange={(e) => setIsNewUser(e.target.checked)}
                className="h-4 w-4 text-green-600 rounded"
              />
              <label htmlFor="newUser" className="ml-2 text-sm text-gray-700">
                New User / புதிய பயனர்
              </label>
            </div>

            {/* Additional fields for new users */}
            {isNewUser && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name / பெயர்
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your name"
                    required={isNewUser}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Village / கிராமம்
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.village}
                      onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your village name"
                      required={isNewUser}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md transform hover:scale-105 transition-all"
            >
              Continue / தொடரவும்
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Need help? Call: <span className="font-semibold">1800-XXX-XXXX</span>
            </p>
            <TamilText 
              text="உதவி தேவையா? அழைக்கவும்: 1800-XXX-XXXX" 
              className="text-xs text-gray-500 mt-1"
            />
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="w-full mt-4 text-gray-600 hover:text-gray-900"
        >
          ← Back to Home / முகப்புக்கு திரும்பு
        </button>
      </div>
    </div>
    </AnimatedPage>
  );
};

export default FarmerLogin;
