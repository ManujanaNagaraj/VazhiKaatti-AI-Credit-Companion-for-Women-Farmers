import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, CheckCircle, Clock, FileCheck, AlertCircle } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';

const OfficerDashboard = () => {
  const [stats, setStats] = useState({
    totalFarmers: 1250,
    pendingVerifications: 45,
    approvedThisMonth: 89,
    averageCreditScore: 672
  });

  const [recentApplications, setRecentApplications] = useState([
    {
      id: 'FMR12345678',
      name: 'அமுதா குமாரி',
      village: 'Thiruvarur',
      creditScore: 680,
      status: 'pending',
      appliedDate: '2026-03-05',
      scheme: 'Kisan Credit Card'
    },
    {
      id: 'FMR23456789',
      name: 'லட்சுமி தேவி',
      village: 'Thanjavur',
      creditScore: 720,
      status: 'verified',
      appliedDate: '2026-03-04',
      scheme: 'PMKSY'
    },
    {
      id: 'FMR34567890',
      name: 'கௌசல்யா',
      village: 'Nagapattinam',
      creditScore: 595,
      status: 'pending',
      appliedDate: '2026-03-04',
      scheme: 'PM-KISAN'
    }
  ]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'verified': return <CheckCircle className="h-5 w-5" />;
      case 'pending': return <Clock className="h-5 w-5" />;
      case 'rejected': return <AlertCircle className="h-5 w-5" />;
      default: return <FileCheck className="h-5 w-5" />;
    }
  };

  const handleVerify = (applicationId) => {
    setRecentApplications(apps =>
      apps.map(app =>
        app.id === applicationId ? { ...app, status: 'verified' } : app
      )
    );
    setStats(prev => ({
      ...prev,
      pendingVerifications: prev.pendingVerifications - 1,
      approvedThisMonth: prev.approvedThisMonth + 1
    }));
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Officer Dashboard</h1>
              <p className="text-gray-600 mt-1">VazhiKaatti - Agricultural Officer Portal</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Officer ID: AGR2026001</span>
              <div className="h-10 w-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                AO
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            icon={<Users className="h-8 w-8 text-blue-600" />}
            title="Total Farmers"
            value={stats.totalFarmers.toLocaleString()}
            bgColor="bg-blue-50"
          />
          <DashboardCard
            icon={<Clock className="h-8 w-8 text-yellow-600" />}
            title="Pending Verifications"
            value={stats.pendingVerifications}
            bgColor="bg-yellow-50"
          />
          <DashboardCard
            icon={<CheckCircle className="h-8 w-8 text-green-600" />}
            title="Approved This Month"
            value={stats.approvedThisMonth}
            bgColor="bg-green-50"
          />
          <DashboardCard
            icon={<TrendingUp className="h-8 w-8 text-purple-600" />}
            title="Avg Credit Score"
            value={stats.averageCreditScore}
            bgColor="bg-purple-50"
          />
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Farmer ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Village
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credit Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Scheme
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {app.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 tamil-text">
                      {app.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {app.village}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-semibold ${
                        app.creditScore >= 700 ? 'bg-green-100 text-green-800' :
                        app.creditScore >= 600 ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {app.creditScore}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {app.scheme}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                        {getStatusIcon(app.status)}
                        <span className="capitalize">{app.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {app.status === 'pending' ? (
                        <button
                          onClick={() => handleVerify(app.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          Verify
                        </button>
                      ) : (
                        <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg font-medium">
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <ActionCard
            title="Generate Report"
            description="Download monthly verification report"
            buttonText="Generate"
            buttonColor="bg-blue-600 hover:bg-blue-700"
          />
          <ActionCard
            title="Bulk Upload"
            description="Upload farmer data in bulk"
            buttonText="Upload"
            buttonColor="bg-purple-600 hover:bg-purple-700"
          />
          <ActionCard
            title="Scheme Updates"
            description="View latest scheme modifications"
            buttonText="View Updates"
            buttonColor="bg-green-600 hover:bg-green-700"
          />
        </div>
      </main>
    </div>
  );
};

const DashboardCard = ({ icon, title, value, bgColor }) => {
  return (
    <div className={`${bgColor} rounded-xl p-6 shadow`}>
      <div className="flex items-center justify-between mb-2">
        {icon}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{title}</div>
    </div>
  );
};

const ActionCard = ({ title, description, buttonText, buttonColor }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <button className={`w-full ${buttonColor} text-white px-4 py-2 rounded-lg font-medium transition-colors`}>
        {buttonText}
      </button>
    </div>
  );
};

export default OfficerDashboard;
