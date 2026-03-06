import React, { useState, useEffect } from 'react';
import { Award, FileText, ExternalLink, CheckCircle, IndianRupee } from 'lucide-react';
import TamilText from '../components/TamilText';

const SchemeMatcher = () => {
  const [schemes, setSchemes] = useState([]);
  const [creditScore, setCreditScore] = useState(0);
  const [selectedScheme, setSelectedScheme] = useState(null);

  useEffect(() => {
    const score = parseInt(localStorage.getItem('creditScore') || '600');
    setCreditScore(score);
    loadSchemes(score);
  }, []);

  const loadSchemes = (score) => {
    // Mock data - in production, fetch from API
    const allSchemes = [
      {
        id: 'PM-KISAN',
        name: 'Pradhan Mantri Kisan Samman Nidhi',
        nameTamil: 'பிரதான மந்திரி கிசான் சம்மன் நிதி',
        description: 'Direct income support of ₹6000/year to farmer families',
        benefits: '₹6000 per year in 3 installments',
        eligibility: 'All farmer families with cultivable land',
        documents: ['Aadhaar', 'Land Records', 'Bank Account'],
        matchScore: 95,
        minCreditScore: 0
      },
      {
        id: 'KISAN-CREDIT',
        name: 'Kisan Credit Card (KCC)',
        nameTamil: 'கிசான் கிரெடிட் கார்டு',
        description: 'Credit facility for agricultural needs at subsidized rates',
        benefits: 'Credit up to ₹3 lakhs at 4% interest',
        eligibility: 'Farmers with land ownership and good credit history',
        documents: ['Aadhaar', 'Land Documents', 'Income Proof'],
        matchScore: score >= 550 ? 90 : 60,
        minCreditScore: 550
      },
      {
        id: 'MAHILA-KISAN',
        name: 'Mahila Kisan Sashaktikaran Pariyojana',
        nameTamil: 'மகிளா கிசான் சக்திகரண பரியோஜனா',
        description: 'Women farmer empowerment program with training and resources',
        benefits: 'Training, sustainable agriculture practices, market linkages',
        eligibility: 'Women farmers engaged in agriculture',
        documents: ['Aadhaar', 'Farmer ID', 'Self Declaration'],
        matchScore: 92,
        minCreditScore: 0
      },
      {
        id: 'CROP-INSURANCE',
        name: 'Pradhan Mantri Fasal Bima Yojana',
        nameTamil: 'பிரதான மந்திரி பாசல் பீமா யோஜனா',
        description: 'Comprehensive crop insurance against natural calamities',
        benefits: 'Premium subsidy and compensation for crop loss',
        eligibility: 'All farmers growing notified crops',
        documents: ['Aadhaar', 'Land Records', 'Sowing Certificate'],
        matchScore: 88,
        minCreditScore: 0
      },
      {
        id: 'MICRO-IRRIGATION',
        name: 'Pradhan Mantri Krishi Sinchayee Yojana',
        nameTamil: 'பிரதான மந்திரி கிருஷி சிஞ்சாயீ யோஜனா',
        description: 'Subsidy for micro-irrigation systems (drip/sprinkler)',
        benefits: 'Up to 90% subsidy for small farmers',
        eligibility: 'Farmers willing to adopt micro-irrigation',
        documents: ['Aadhaar', 'Land Records', 'Bank Account'],
        matchScore: score >= 500 ? 85 : 70,
        minCreditScore: 500
      },
      {
        id: 'SHG-LOAN',
        name: 'Self Help Group Bank Linkage',
        nameTamil: 'சுய உதவி குழு வங்கி இணைப்பு',
        description: 'Collateral-free loans for SHG members',
        benefits: 'Loans up to ₹10 lakhs without collateral at low interest',
        eligibility: 'Active SHG members with good track record',
        documents: ['SHG Membership', 'Aadhaar', 'Group Resolution'],
        matchScore: score >= 450 ? 87 : 75,
        minCreditScore: 450
      }
    ];

    // Filter and sort by match score
    const eligible = allSchemes
      .filter(scheme => score >= scheme.minCreditScore)
      .sort((a, b) => b.matchScore - a.matchScore);
    
    setSchemes(eligible);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Matching Government Schemes</h1>
          <TamilText text="பொருத்தமான அரசு திட்டங்கள்" className="text-xl text-gray-600" />
          <div className="mt-4 inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow">
            <span className="text-sm text-gray-600">Your Credit Score:</span>
            <span className="text-lg font-bold text-green-600">{creditScore}</span>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<Award className="h-8 w-8 text-green-600" />}
            value={schemes.length}
            label="Eligible Schemes"
            labelTamil="தகுதியான திட்டங்கள்"
          />
          <StatCard
            icon={<IndianRupee className="h-8 w-8 text-blue-600" />}
            value="₹15L+"
            label="Potential Benefits"
            labelTamil="சாத்தியமான நன்மைகள்"
          />
          <StatCard
            icon={<CheckCircle className="h-8 w-8 text-purple-600" />}
            value={`${Math.round(schemes.reduce((acc, s) => acc + s.matchScore, 0) / schemes.length)}%`}
            label="Avg Match Score"
            labelTamil="சராசரி பொருத்த மதிப்பெண்"
          />
        </div>

        {/* Schemes List */}
        <div className="space-y-6">
          {schemes.map((scheme) => (
            <SchemeCard
              key={scheme.id}
              scheme={scheme}
              onSelect={() => setSelectedScheme(scheme)}
            />
          ))}
        </div>

        {schemes.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Schemes Found</h3>
            <p className="text-gray-600">
              Please complete your profile assessment to find matching schemes.
            </p>
          </div>
        )}

        {/* Scheme Detail Modal */}
        {selectedScheme && (
          <SchemeDetailModal
            scheme={selectedScheme}
            onClose={() => setSelectedScheme(null)}
          />
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, value, label, labelTamil }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 text-center">
      <div className="flex justify-center mb-3">{icon}</div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
      <TamilText text={labelTamil} className="text-xs text-gray-500" />
    </div>
  );
};

const SchemeCard = ({ scheme, onSelect }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
         onClick={onSelect}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">{scheme.name}</h3>
          <TamilText text={scheme.nameTamil} className="text-gray-600 mb-3" />
          <p className="text-gray-700">{scheme.description}</p>
        </div>
        <div className="ml-4 text-center">
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full">
            <div className="text-2xl font-bold">{scheme.matchScore}%</div>
            <div className="text-xs">Match</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Benefits</h4>
          <p className="text-sm text-gray-600">{scheme.benefits}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Eligibility</h4>
          <p className="text-sm text-gray-600">{scheme.eligibility}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex flex-wrap gap-2">
          {scheme.documents.map((doc, idx) => (
            <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {doc}
            </span>
          ))}
        </div>
        <button className="text-green-600 hover:text-green-700 font-semibold flex items-center space-x-1">
          <span>View Details</span>
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const SchemeDetailModal = ({ scheme, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
         onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
           onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{scheme.name}</h2>
        <TamilText text={scheme.nameTamil} className="text-lg text-gray-600 mb-6" />
        
        <div className="space-y-6">
          <Section title="Description" content={scheme.description} />
          <Section title="Benefits" content={scheme.benefits} />
          <Section title="Eligibility" content={scheme.eligibility} />
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Required Documents</h3>
            <ul className="list-disc list-inside space-y-1">
              {scheme.documents.map((doc, idx) => (
                <li key={idx} className="text-gray-700">{doc}</li>
              ))}
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">How to Apply</h3>
            <ol className="list-decimal list-inside space-y-2 text-green-800">
              <li>Visit the nearest Common Service Center or online portal</li>
              <li>Fill out the application form with required details</li>
              <li>Upload necessary documents</li>
              <li>Submit and track your application status</li>
            </ol>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const Section = ({ title, content }) => {
  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-700">{content}</p>
    </div>
  );
};

export default SchemeMatcher;
