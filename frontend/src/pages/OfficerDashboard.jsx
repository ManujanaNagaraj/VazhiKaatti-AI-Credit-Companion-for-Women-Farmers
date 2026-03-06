import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedPage from '../components/AnimatedPage';

const OfficerDashboard = () => {
  const navigate = useNavigate();
  
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
