import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, TrendingUp, Building2 } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  return (
    <AnimatedPage>
      <div className="landing-page">
        {/* Animated gradient background */}
        <div className="gradient-bg"></div>
        
        {/* Grain texture overlay */}
        <div className="grain-overlay"></div>

        {/* Hero Section */}
        <section className="hero-section">
          <motion.div
            className="hero-content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 className="main-title" variants={itemVariants}>
              VazhiKaatti
            </motion.h1>
            
            <motion.h2 className="tamil-subtitle" variants={itemVariants}>
              வழிகாட்டி
            </motion.h2>
            
            <motion.p className="tamil-tagline" variants={itemVariants}>
              உங்கள் உழைப்புக்கு நீதியான கடன்
            </motion.p>
            
            <motion.p className="english-tagline" variants={itemVariants}>
              AI-Powered Credit Scoring for Women Farmers of Tamil Nadu
            </motion.p>
            
            <motion.button
              className="cta-button"
              variants={itemVariants}
              onClick={() => navigate('/login')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              தொடங்குங்கள் →
            </motion.button>
          </motion.div>
        </section>

        {/* Feature Cards */}
        <section className="features-section">
          <motion.div
            className="features-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div className="feature-card" variants={cardVariants} whileHover={{ y: -10 }}>
              <div className="feature-icon">🎤</div>
              <h3 className="feature-title">Tamil Voice Input</h3>
              <p className="feature-description">பேசுங்கள், நாங்கள் கேட்கிறோம்</p>
            </motion.div>

            <motion.div className="feature-card" variants={cardVariants} whileHover={{ y: -10 }}>
              <div className="feature-icon">🤖</div>
              <h3 className="feature-title">AI Credit Score</h3>
              <p className="feature-description">உங்கள் உழைப்பே உங்கள் மதிப்பு</p>
            </motion.div>

            <motion.div className="feature-card" variants={cardVariants} whileHover={{ y: -10 }}>
              <div className="feature-icon">🏦</div>
              <h3 className="feature-title">Scheme Matcher</h3>
              <p className="feature-description">சரியான திட்டம், சரியான நேரம்</p>
            </motion.div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="landing-footer">
          <p>TNWISE 2026 Hackathon Project | Agriculture Domain</p>
        </footer>
      </div>
    </AnimatedPage>
  );
};

export default LandingPage;
