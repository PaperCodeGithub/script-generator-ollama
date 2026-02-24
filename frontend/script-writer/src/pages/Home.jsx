import React from 'react';
import '../styles/Home.css';

export default function Home({ setCurrentPage }) {
  return (
    <div className="home-container">
      
      <section id="intro" className="home-section intro-section">
        <div className="home-content">
          <h1 className="home-title">Write scripts that feel <span className="highlight">human</span></h1>
          <p className="home-subtitle">
            Powered by advanced local LLMs, Director's Cut turns your raw plots and character ideas into formatted, emotionally resonant screenplays in seconds.
          </p>
          <button 
            className="home-cta-btn"
            onClick={() => {
              setCurrentPage('generator');
              window.scrollTo(0, 0);
            }}
          >
            Open Generator
          </button>
        </div>
      </section>

      <section id="usage" className="home-section usage-section">
        <div className="home-content-shadow">
          <h2>How to Use the Generator</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Set the Scene</h3>
              <p>Type out your raw plot idea, setting, and the central conflict. Don't worry about formatting; the AI handles that.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Cast the Roles</h3>
              <p>Add your characters. Give them names, ages, and distinct personalities so the AI knows how they should speak.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Action!</h3>
              <p>Hit generate. The RAG pipeline processes your scene and characters, outputting standard screenplay dialogue.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="home-section about-section">
        <div className="home-content text-center">
          <h2>About Me</h2>
          <p className="about-text">
            I'm a software engineer with a passion for storytelling and AI. I built this project to explore how local LLMs can empower creatives to bring their stories to life without needing technical expertise.
            If you have any feedback or want to chat about AI and storytelling, feel free to reach out on LinkedIn or Twitter!
            <div className="social-links">
              <a href="https://www.linkedin.com/in/aritradaspersonal" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="https://www.instagram.com/paper.code.world" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://github.com/papercodegithub" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div> 
          </p>
        </div>
      </section>

    </div>
  );
}