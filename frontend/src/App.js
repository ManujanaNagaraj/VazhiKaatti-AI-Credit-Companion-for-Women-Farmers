import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import FarmerLogin from './pages/FarmerLogin';
import AdminLogin from './pages/AdminLogin';
import LoginPage from './pages/LoginPage';
import FarmerProfile from './pages/FarmerProfile';
import Questions from './pages/Questions';
import CreditScore from './pages/CreditScore';
import SchemeMatcher from './pages/SchemeMatcher';
import OfficerDashboard from './pages/OfficerDashboard';

function ProtectedRoute({ children, role }) {
  if (role === 'admin') {
    const isAdmin = localStorage.getItem('admin_verified') === 'true';
    return isAdmin ? children : <Navigate to="/" replace />;
  } else {
    const isFarmer = localStorage.getItem('farmer_verified') === 'true';
    return isFarmer ? children : <Navigate to="/" replace />;
  }
}

function AnimatedRoutes() {
  const location = useLocation();
  const isAuthPage = ['/', '/farmer-login', '/admin-login', '/officer'].includes(location.pathname);

  return (
    <>
      {!isAuthPage && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Auth Routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/farmer-login" element={<FarmerLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Protected Farmer Routes */}
          <Route path="/home" element={<ProtectedRoute><LandingPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><FarmerProfile /></ProtectedRoute>} />
          <Route path="/questions" element={<ProtectedRoute><Questions /></ProtectedRoute>} />
          <Route path="/score" element={<ProtectedRoute><CreditScore /></ProtectedRoute>} />
          <Route path="/schemes" element={<ProtectedRoute><SchemeMatcher /></ProtectedRoute>} />

          {/* Protected Admin Routes */}
          <Route path="/officer" element={<ProtectedRoute role="admin"><OfficerDashboard /></ProtectedRoute>} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;
