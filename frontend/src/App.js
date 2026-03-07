import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import ChatBot from './components/ChatBot';
import HelpButton from './components/HelpButton';
import LandingPage from './pages/LandingPage';
import FarmerLogin from './pages/FarmerLogin';
import FarmerProfile from './pages/FarmerProfile';
import Questions from './pages/Questions';
import CreditScore from './pages/CreditScore';
import SchemeMatcher from './pages/SchemeMatcher';
import OfficerDashboard from './pages/OfficerDashboard';
import { ROUTES } from './constants';

function AnimatedRoutes() {
  const location = useLocation();
  
  // Context-aware help instructions based on current page
  const getHelpInstructions = () => {
    switch (location.pathname) {
      case ROUTES.HOME:
        return 'வணக்கம்! வழிகாட்டி பயன்பாட்டில் உங்களை வரவேற்கிறோம். தொடங்குங்கள் பொத்தானை அழுத்தி உங்கள் கடன் மதிப்பெண்ணை சரிபார்க்கவும்.';
      case ROUTES.LOGIN:
        return 'உங்கள் பெயர், வயது, கிராமம், மற்றும் மாவட்டத்தை உள்ளிடவும். பின்னர் அடுத்த பக்கத்திற்கு செல்லவும்.';
      case ROUTES.PROFILE:
        return 'இங்கே உங்கள் விவசாய விவரங்கள் மற்றும் கடன் மதிப்பெண் கணக்கீடு காட்டப்படும். கேள்விகளுக்கு பதிலளிக்கவும்.';
      case ROUTES.QUESTIONS:
        return 'ஒவ்வொரு கேள்விக்கும் பதிலளிக்கவும். நீங்கள் பேசலாம் அல்லது தட்டச்சு செய்யலாம். அனைத்து கேள்விகளுக்கும் பதிலளித்த பிறகு உங்கள் மதிப்பெண் கணக்கிடப்படும்.';
      case ROUTES.SCORE:
        return 'இது உங்கள் கடன் மதிப்பெண் முடிவு. நீங்கள் உங்கள் மதிப்பெண்ணை பகிரலாம் அல்லது பொருத்தமான திட்டங்களை பார்க்கலாம்.';
      case ROUTES.SCHEMES:
        return 'உங்கள் மதிப்பெண்ணுக்கு ஏற்ற அரசாங்க திட்டங்கள் இங்கே காட்டப்படும். ஒவ்வொரு திட்டத்தையும் கிளிக் செய்து விவரங்களை பார்க்கவும்.';
      case ROUTES.OFFICER:
        return 'இது அதிகாரி டாஷ்போர்டு. விண்ணப்பங்களை மதிப்பாய்வு செய்யவும் மற்றும் அங்கீகரிக்கவும்.';
      default:
        return 'வழிகாட்டி உங்களுக்கு உதவ இங்கே உள்ளது. ஏதேனும் உதவி தேவையா என்றால் பேசும் பொத்தானை அழுத்தவும்.';
    }
  };
  
  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path={ROUTES.HOME} element={<LandingPage />} />
          <Route path={ROUTES.LOGIN} element={<FarmerLogin />} />
          <Route path={ROUTES.PROFILE} element={<FarmerProfile />} />
          <Route path={ROUTES.QUESTIONS} element={<Questions />} />
          <Route path={ROUTES.SCORE} element={<CreditScore />} />
          <Route path={ROUTES.SCHEMES} element={<SchemeMatcher />} />
          <Route path={ROUTES.OFFICER} element={<OfficerDashboard />} />
        </Routes>
      </AnimatePresence>
      <HelpButton instructions={getHelpInstructions()} />
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <AnimatedRoutes />
        <ChatBot />
      </div>
    </Router>
  );
}

export default App;
