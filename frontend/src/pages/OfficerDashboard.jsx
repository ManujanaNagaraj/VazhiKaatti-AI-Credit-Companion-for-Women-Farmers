import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, FileText, CheckCircle, Clock, XCircle, Search } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';

const OfficerDashboard = () => {
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  
  const [applications, setApplications] = useState([
    { id: 1, name: 'கமலா தேவி', village: 'Thanjavur', score: 85, grade: 'Excellent', scheme_applied: 'PM-KISAN', status: 'Pending', applied_date: '2026-02-15' },
    { id: 2, name: 'செல்வி முத்து', village: 'Trichy', score: 72, grade: 'Good', scheme_applied: 'Kisan Credit Card', status: 'Approved', applied_date: '2026-02-20' },
    { id: 3, name: 'லட்சுமி பாண்டியன்', village: 'Madurai', score: 58, grade: 'Fair', scheme_applied: 'PMKSY', status: 'Pending', applied_date: '2026-02-25' },
    { id: 4, name: 'மீனாட்சி குமார்', village: 'Coimbatore', score: 35, grade: 'Poor', scheme_applied: 'Soil Health Card', status: 'Rejected', applied_date: '2026-03-01' },
    { id: 5, name: 'ராஜலட்சுமி', village: 'Salem', score: 90, grade: 'Excellent', scheme_applied: 'PM-KISAN', status: 'Approved', applied_date: '2026-03-02' },
    { id: 6, name: 'சரஸ்வதி ராஜன்', village: 'Erode', score: 68, grade: 'Fair', scheme_applied: 'PMFBY', status: 'Pending', applied_date: '2026-03-03' },
    { id: 7, name: 'பத்மா வெங்கடேஷ்', village: 'Tirunelveli', score: 78, grade: 'Good', scheme_applied: 'Kisan Credit Card', status: 'Approved', applied_date: '2026-03-04' },
    { id: 8, name: 'அனிதா மாரி', village: 'Kanchipuram', score: 42, grade: 'Fair', scheme_applied: 'PMKSY', status: 'Pending', applied_date: '2026-03-05' },
    { id: 9, name: 'வசந்தி பாலு', village: 'Vellore', score: 88, grade: 'Excellent', scheme_applied: 'PM-KISAN', status: 'Approved', applied_date: '2026-03-05' },
    { id: 10, name: 'கல்பனா ரவி', village: 'Dharmapuri', score: 55, grade: 'Fair', scheme_applied: 'Soil Health Card', status: 'Pending', applied_date: '2026-03-06' }
  ]);

  return (
    <AnimatedPage>
      <div className="min-h-screen" style={{ backgroundColor: '#0F1B2D' }}>
        {/* Header */}
        <header className="border-b" style={{ borderColor: '#1e3a5f' }}>
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <h1 
                className="text-3xl font-bold" 
                style={{ color: '#D4A017', fontFamily: 'Noto Sans Tamil, sans-serif' }}
              >
                VazhiKaatti — அதிகாரி போர்டல்
              </h1>
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:scale-105"
                style={{ backgroundColor: '#1e3a5f', color: '#D4A017' }}
              >
                <LogOut size={20} />
                <span className="font-semibold">Logout</span>
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="rounded-xl p-6 shadow-lg" style={{ backgroundColor: '#1e3a5f' }}>
              <div className="flex items-center justify-between mb-3">
                <FileText size={36} style={{ color: '#D4A017' }} />
              </div>
              <div className="text-3xl font-bold mb-2" style={{ color: '#D4A017' }}>
                {applications.length}
              </div>
              <div className="text-sm font-semibold" style={{ color: '#E8F4EA' }}>
                Total Applications
              </div>
            </div>
            
            <div className="rounded-xl p-6 shadow-lg" style={{ backgroundColor: '#1e3a5f' }}>
              <div className="flex items-center justify-between mb-3">
                <CheckCircle size={36} style={{ color: '#27AE60' }} />
              </div>
              <div className="text-3xl font-bold mb-2" style={{ color: '#27AE60' }}>
                {applications.filter(app => app.status === 'Approved').length}
              </div>
              <div className="text-sm font-semibold" style={{ color: '#E8F4EA' }}>
                Approved
              </div>
            </div>
            
            <div className="rounded-xl p-6 shadow-lg" style={{ backgroundColor: '#1e3a5f' }}>
              <div className="flex items-center justify-between mb-3">
                <Clock size={36} style={{ color: '#E67E22' }} />
              </div>
              <div className="text-3xl font-bold mb-2" style={{ color: '#E67E22' }}>
                {applications.filter(app => app.status === 'Pending').length}
              </div>
              <div className="text-sm font-semibold" style={{ color: '#E8F4EA' }}>
                Pending
              </div>
            </div>
            
            <div className="rounded-xl p-6 shadow-lg" style={{ backgroundColor: '#1e3a5f' }}>
              <div className="flex items-center justify-between mb-3">
                <XCircle size={36} style={{ color: '#C0392B' }} />
              </div>
              <div className="text-3xl font-bold mb-2" style={{ color: '#C0392B' }}>
                {applications.filter(app => app.status === 'Rejected').length}
              </div>
              <div className="text-sm font-semibold" style={{ color: '#E8F4EA' }}>
                Rejected
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search 
                size={20} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2" 
                style={{ color: '#6B7280' }} 
              />
              <input
                type="text"
                placeholder="Search by farmer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg font-medium"
                style={{ 
                  backgroundColor: '#1e3a5f', 
                  color: '#E8F4EA',
                  border: '2px solid #2D5A7B'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default OfficerDashboard;
