import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, TrendingUp, Users, Award } from 'lucide-react';
import TamilText from '../components/TamilText';
import AnimatedPage from '../components/AnimatedPage';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Leaf className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">VazhiKaatti</h1>
                <TamilText text="வழிகாட்டி" className="text-sm text-gray-600" />
              </div>
            </div>
            <button
              onClick={() => navigate('/officer')}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
            >
              Officer Login
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            AI Credit Companion for Women Farmers
          </h2>
          <TamilText 
            text="பெண் விவசாயிகளுக்கான AI கடன் துணை" 
            className="text-2xl text-gray-700 mb-8"
          />
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Empowering women farmers with AI-driven credit scoring and personalized 
            government scheme recommendations
          </p>
          
          <button
            onClick={() => navigate('/login')}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-lg text-lg shadow-lg transform hover:scale-105 transition-all"
          >
            Get Started / தொடங்குங்கள்
          </button>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<TrendingUp className="h-8 w-8 text-green-600" />}
            title="AI Credit Scoring"
            tamilTitle="AI கடன் மதிப்பீடு"
            description="Get instant credit score based on your farming profile"
          />
          <FeatureCard
            icon={<Award className="h-8 w-8 text-blue-600" />}
            title="Scheme Matching"
            tamilTitle="திட்ட பொருத்தம்"
            description="Discover government schemes you're eligible for"
          />
          <FeatureCard
            icon={<Users className="h-8 w-8 text-purple-600" />}
            title="Voice Input"
            tamilTitle="குரல் உள்ளீடு"
            description="Answer questions using voice in Tamil or English"
          />
          <FeatureCard
            icon={<Leaf className="h-8 w-8 text-green-600" />}
            title="Easy Access"
            tamilTitle="எளிய அணுகல்"
            description="Simple interface designed for rural connectivity"
          />
        </div>

        {/* Statistics */}
        <div className="mt-24 bg-white rounded-xl shadow-xl p-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">1,250+</div>
              <div className="text-gray-600">Farmers Registered</div>
              <TamilText text="பதிவு செய்யப்பட்ட விவசாயிகள்" className="text-sm text-gray-500" />
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">₹45 Cr</div>
              <div className="text-gray-600">Loans Approved</div>
              <TamilText text="அங்கீகரிக்கப்பட்ட கடன்கள்" className="text-sm text-gray-500" />
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">15+</div>
              <div className="text-gray-600">Government Schemes</div>
              <TamilText text="அரசு திட்டங்கள்" className="text-sm text-gray-500" />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-24 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2026 VazhiKaatti. Empowering Women Farmers.</p>
        </div>
      </footer>
    </div>
    </AnimatedPage>
  );
};

const FeatureCard = ({ icon, title, tamilTitle, description }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <TamilText text={tamilTitle} className="text-sm text-gray-600 mb-3" />
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

export default LandingPage;
