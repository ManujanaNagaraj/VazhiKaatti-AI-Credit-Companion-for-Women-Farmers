import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Mic, TrendingUp, Building2 } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import { ROUTES } from '../constants';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  
  // Animated Counter
  const [farmerCount, setFarmerCount] = useState(0);
  const [loanAmount, setLoanAmount] = useState(0);

  useEffect(() => {
    // Animate farmer count from 0 to 1247
    const farmerControls = animate(0, 1247, {
      duration: 2,
      onUpdate: (value) => setFarmerCount(Math.floor(value))
    });

    // Animate loan amount from 0 to 3.2 (crores)
    const loanControls = animate(0, 3.2, {
      duration: 2,
      onUpdate: (value) => setLoanAmount(value)
    });

    return () => {
      farmerControls.stop();
      loanControls.stop();
    };
  }, []);

  // Floating emojis
  const floatingEmojis = ['🌾', '🌱', '💧', '🌿', '🌾', '🌱', '💧', '🌿'];

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

        {/* Floating Farmer Emojis */}
        <div className="floating-emojis">
          {floatingEmojis.map((emoji, index) => (
            <motion.div
              key={index}
              className="floating-emoji"
              style={{
                left: `${(index * 12) + 5}%`,
                fontSize: '2.5rem',
                position: 'absolute',
                bottom: '-50px'
              }}
              animate={{
                y: [0, -window.innerHeight - 100],
                opacity: [0, 1, 1, 0],
                rotate: [0, 360]
              }}
              transition={{
                duration: 15 + (index * 2),
                repeat: Infinity,
                delay: index * 1.5,
                ease: 'linear'
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>

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
              onClick={() => navigate(ROUTES.LOGIN)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              தொடங்குங்கள் →
            </motion.button>
          </motion.div>
        </section>

        {/* Impact Counter Section */}
        <section className="impact-section">
          <motion.div
            className="impact-container"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h3 
              className="impact-title"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              நமது தாக்கம்
            </motion.h3>
            
            <div className="impact-stats">
              <motion.div 
                className="stat-card"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div 
                  className="stat-number"
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '3.5rem',
                    fontWeight: '700',
                    color: '#D4A017'
                  }}
                >
                  {farmerCount.toLocaleString('en-IN')}
                </motion.div>
                <div 
                  className="stat-label"
                  style={{
                    fontFamily: 'Noto Sans Tamil, sans-serif',
                    fontSize: '1.25rem',
                    color: '#FAF7F0',
                    marginTop: '0.5rem'
                  }}
                >
                  விவசாயிகள் பயன்பெற்றனர்
                </div>
                <div style={{ color: '#FAF7F0', opacity: 0.8, marginTop: '0.25rem' }}>
                  Farmers Empowered
                </div>
              </motion.div>

              <motion.div 
                className="stat-card"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div 
                  className="stat-number"
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '3.5rem',
                    fontWeight: '700',
                    color: '#D4A017'
                  }}
                >
                  ₹{loanAmount.toFixed(1)} Cr
                </motion.div>
                <div 
                  className="stat-label"
                  style={{
                    fontFamily: 'Noto Sans Tamil, sans-serif',
                    fontSize: '1.25rem',
                    color: '#FAF7F0',
                    marginTop: '0.5rem'
                  }}
                >
                  கடன் வழங்கப்பட்டது
                </div>
                <div style={{ color: '#FAF7F0', opacity: 0.8, marginTop: '0.25rem' }}>
                  Loans Facilitated
                </div>
              </motion.div>
            </div>
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
