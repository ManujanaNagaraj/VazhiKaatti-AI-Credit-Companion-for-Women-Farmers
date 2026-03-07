import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, FileText, CheckCircle, Clock, XCircle, Search, Check, X, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedPage from '../components/AnimatedPage';

const OfficerDashboard = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');

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

  // Filter applications based on search and grade
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = gradeFilter === 'All' || app.grade === gradeFilter;
    return matchesSearch && matchesGrade;
  });

  const handleApprove = (id) => {
    if (window.confirm('Approve this application? / இந்த விண்ணப்பத்தை ஒப்புதல் அளிக்கவா?')) {
      setApplications(applications.map(app =>
        app.id === id ? { ...app, status: 'Approved' } : app
      ));
    }
  };

  const handleReject = (id) => {
    if (window.confirm('Reject this application? / இந்த விண்ணப்பத்தை நிராகரிக்கவா?')) {
      setApplications(applications.map(app =>
        app.id === id ? { ...app, status: 'Rejected' } : app
      ));
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Village', 'Score', 'Grade', 'Scheme', 'Status', 'Applied Date'];
    const csvData = filteredApplications.map(app => [
      app.name,
      app.village,
      app.score,
      app.grade,
      app.scheme_applied,
      app.status,
      app.applied_date
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `farmer_applications_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

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
                onClick={() => {
                  localStorage.clear();
                  navigate('/');
                }}
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
              className="rounded-xl p-6 shadow-lg"
              style={{ backgroundColor: '#1e3a5f' }}
            >
              <div className="flex items-center justify-between mb-3">
                <FileText size={36} style={{ color: '#D4A017' }} />
              </div>
              <div className="text-3xl font-bold mb-2" style={{ color: '#D4A017' }}>
                {applications.length}
              </div>
              <div className="text-sm font-semibold" style={{ color: '#E8F4EA' }}>
                Total Applications
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl p-6 shadow-lg"
              style={{ backgroundColor: '#1e3a5f' }}
            >
              <div className="flex items-center justify-between mb-3">
                <CheckCircle size={36} style={{ color: '#27AE60' }} />
              </div>
              <div className="text-3xl font-bold mb-2" style={{ color: '#27AE60' }}>
                {applications.filter(app => app.status === 'Approved').length}
              </div>
              <div className="text-sm font-semibold" style={{ color: '#E8F4EA' }}>
                Approved
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl p-6 shadow-lg"
              style={{ backgroundColor: '#1e3a5f' }}
            >
              <div className="flex items-center justify-between mb-3">
                <Clock size={36} style={{ color: '#E67E22' }} />
              </div>
              <div className="text-3xl font-bold mb-2" style={{ color: '#E67E22' }}>
                {applications.filter(app => app.status === 'Pending').length}
              </div>
              <div className="text-sm font-semibold" style={{ color: '#E8F4EA' }}>
                Pending
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl p-6 shadow-lg"
              style={{ backgroundColor: '#1e3a5f' }}
            >
              <div className="flex items-center justify-between mb-3">
                <XCircle size={36} style={{ color: '#C0392B' }} />
              </div>
              <div className="text-3xl font-bold mb-2" style={{ color: '#C0392B' }}>
                {applications.filter(app => app.status === 'Rejected').length}
              </div>
              <div className="text-sm font-semibold" style={{ color: '#E8F4EA' }}>
                Rejected
              </div>
            </motion.div>
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

            {/* Grade Filter Dropdown */}
            <div className="md:w-64">
              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-medium"
                style={{
                  backgroundColor: '#1e3a5f',
                  color: '#E8F4EA',
                  border: '2px solid #2D5A7B'
                }}
              >
                <option value="All">All Grades</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
          </div>

          {/* Export CSV Button */}
          <div className="mb-6 flex justify-end">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
              style={{ backgroundColor: '#D4A017', color: '#0F1B2D' }}
            >
              <Download size={20} />
              Export CSV
            </button>
          </div>

          {/* Applications Table */}
          <div className="rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: '#1e3a5f' }}>
            <div className="overflow-x-auto">
              <table className="w-full" style={{ minWidth: '800px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#152943' }}>
                    <th className="px-4 md:px-6 py-4 text-left text-sm font-bold" style={{ color: '#D4A017' }}>
                      Name
                    </th>
                    <th className="px-4 md:px-6 py-4 text-left text-sm font-bold" style={{ color: '#D4A017' }}>
                      Village
                    </th>
                    <th className="px-4 md:px-6 py-4 text-left text-sm font-bold" style={{ color: '#D4A017' }}>
                      Score
                    </th>
                    <th className="px-4 md:px-6 py-4 text-left text-sm font-bold" style={{ color: '#D4A017' }}>
                      Grade
                    </th>
                    <th className="px-4 md:px-6 py-4 text-left text-sm font-bold" style={{ color: '#D4A017' }}>
                      Scheme
                    </th>
                    <th className="px-4 md:px-6 py-4 text-left text-sm font-bold" style={{ color: '#D4A017' }}>
                      Status
                    </th>
                    <th className="px-4 md:px-6 py-4 text-left text-sm font-bold" style={{ color: '#D4A017' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app, index) => (
                    <motion.tr
                      key={app.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-t transition-colors hover:bg-opacity-50"
                      style={{ borderColor: '#2D5A7B', backgroundColor: 'transparent' }}
                      whileHover={{ backgroundColor: '#1a2f47' }}
                    >
                      <td
                        className="px-4 md:px-6 py-4 text-sm font-medium"
                        style={{ color: '#E8F4EA', fontFamily: 'Noto Sans Tamil, sans-serif' }}
                      >
                        {app.name}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-sm" style={{ color: '#B8C5D0' }}>
                        {app.village}
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <span
                          className="inline-block px-3 py-1 rounded-full text-sm font-bold"
                          style={{
                            backgroundColor: app.score <= 40 ? '#C0392B' : app.score <= 70 ? '#E67E22' : '#27AE60',
                            color: '#FFFFFF'
                          }}
                        >
                          {app.score}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-sm" style={{ color: '#B8C5D0' }}>
                        {app.grade}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-sm" style={{ color: '#B8C5D0' }}>
                        {app.scheme_applied}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-sm font-semibold" style={{ color: '#E8F4EA' }}>
                        {app.status}
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        {app.status === 'Pending' ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(app.id)}
                              className="px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:scale-105 flex items-center gap-2"
                              style={{ backgroundColor: '#27AE60', color: '#FFFFFF' }}
                            >
                              <Check size={16} />
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(app.id)}
                              className="px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:scale-105 flex items-center gap-2"
                              style={{ backgroundColor: '#C0392B', color: '#FFFFFF' }}
                            >
                              <X size={16} />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm" style={{ color: '#B8C5D0' }}>
                            {app.status}
                          </span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default OfficerDashboard;
