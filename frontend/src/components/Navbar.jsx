import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../constants';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: ROUTES.HOME, label: 'Home', tamil: 'முகப்பு' },
    { path: ROUTES.LOGIN, label: 'Login', tamil: 'உள்நுழைவு' },
    { path: ROUTES.PROFILE, label: 'Profile', tamil: 'சுயவிவரம்' },
    { path: ROUTES.QUESTIONS, label: 'Assessment', tamil: 'மதிப்பீடு' },
    { path: ROUTES.SCORE, label: 'Score', tamil: 'மதிப்பெண்' },
    { path: ROUTES.SCHEMES, label: 'Schemes', tamil: 'திட்டங்கள்' },
    { path: ROUTES.OFFICER, label: 'Officer', tamil: 'அலுவலர்' }
  ];

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to={ROUTES.HOME} className="navbar-logo">
          <div className="logo-icon">
            <span className="leaf">🌾</span>
          </div>
          <div className="logo-text">
            <span className="logo-title">VazhiKaatti</span>
            <span className="logo-subtitle tamil-text">வழிகாட்டி</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <ul className="navbar-menu">
          {navLinks.map((link) => (
            <li key={link.path} className="navbar-item">
              <Link
                to={link.path}
                className={`navbar-link ${isActive(link.path) ? 'active' : ''}`}
              >
                <span className="link-label">{link.label}</span>
                <span className="link-tamil tamil-text">{link.tamil}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Toggle */}
        <button
          className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span className="toggle-bar"></span>
          <span className="toggle-bar"></span>
          <span className="toggle-bar"></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar-mobile ${isMenuOpen ? 'active' : ''}`}>
        <ul className="navbar-mobile-menu">
          {navLinks.map((link) => (
            <li key={link.path} className="navbar-mobile-item">
              <Link
                to={link.path}
                className={`navbar-mobile-link ${isActive(link.path) ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="link-label">{link.label}</span>
                <span className="link-tamil tamil-text">{link.tamil}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
