import React, { useState } from 'react';
import '../styles/NavBarStyle.css';
import logo from "../assets/logo.png";
export default function Navbar({ currentPage, setCurrentPage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleNavClick = (page, sectionId = null, tabName) => {
    setCurrentPage(page);
    setActiveTab(tabName);
    setIsOpen(false);

    if (sectionId) {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className="sg-navbar">
      <div className="sg-nav-container">
        <div 
          className="sg-nav-logo" 
          onClick={() => handleNavClick('home', null, 'home')}
        >
          <span className="sg-logo-icon"><img src={logo} alt="Directero Logo" /></span>
          <span className="sg-logo-text">DIRECTERO</span>
        </div>

        <button className="sg-mobile-toggle" onClick={toggleMenu}>
          {isOpen ? '✕' : '☰'}
        </button>

        <ul className={`sg-nav-menu ${isOpen ? 'active' : ''}`}>
          <li className="sg-nav-item">
            <button 
              className={`sg-nav-link ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => handleNavClick('home', null, 'home')}
            >
              Home
            </button>
          </li>
          <li className="sg-nav-item">
            <button 
              className={`sg-nav-link ${activeTab === 'usage' ? 'active' : ''}`}
              onClick={() => handleNavClick('home', 'usage', 'usage')}
            >
              Usage
            </button>
          </li>
          <li className="sg-nav-item">
            <button 
              className={`sg-nav-link ${activeTab === 'generator' ? 'active' : ''}`}
              onClick={() => handleNavClick('generator', null, 'generator')}
            >
              Generator
            </button>
          </li>
          <li className="sg-nav-item">
            <button 
              className={`sg-nav-link ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => handleNavClick('home', 'about', 'about')}
            >
              About Us
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}