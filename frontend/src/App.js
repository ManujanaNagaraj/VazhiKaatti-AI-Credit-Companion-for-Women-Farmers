import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import FarmerLogin from './pages/FarmerLogin';
import FarmerProfile from './pages/FarmerProfile';
import Questions from './pages/Questions';
import CreditScore from './pages/CreditScore';
import SchemeMatcher from './pages/SchemeMatcher';
import OfficerDashboard from './pages/OfficerDashboard';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<FarmerLogin />} />
        <Route path="/profile" element={<FarmerProfile />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/score" element={<CreditScore />} />
        <Route path="/schemes" element={<SchemeMatcher />} />
        <Route path="/officer" element={<OfficerDashboard />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;
