import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SectionBox from './SectionBox';
import AIPage from './pages/AIPage';
import '../styles.css';
import './App.css';
import { useEffect } from 'react';

function Home() {
  useEffect(() => {
    // Initialize GSAP animations
    const gsap = (window as any).gsap;
    if (gsap) {
      gsap.to('.hero-title', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "back.out(1.2)"
      });

      gsap.to('.hero-subtitle', {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.3,
        ease: "power3.out"
      });
    }
  }, []);

  return (
    <div className="page-content">
      <div className="blue-orb orb-1"></div>
      <div className="blue-orb orb-2"></div>

      <div className="progress-bar">
        <span className="progress-number">1</span>
        <span className="progress-number">2</span>
        <span className="progress-number">3</span>
      </div>

      <section className="hero-section">
        <div style={{
          width: '100%',
          margin: '0 auto',
          padding: '0 20px',
          boxSizing: 'border-box'
        }}>
          <h1 className="hero-title">I am THE, Chris Attorri</h1>
          <p className="hero-subtitle">Today, you are the lucky recipient of my life story.</p>
        </div>
      </section>

      <div className="feature-grid">
        <div className="feature-item">
          <h3 className="feature-title">AI in Healthcare</h3>
          <p className="feature-description">Explore cutting-edge AI research and developments in healthcare technology.</p>
        </div>

        <div className="feature-item">
          <h3 className="feature-title">Medical Studies</h3>
          <p className="feature-description">Access the latest medical research and EMT training resources.</p>
        </div>
      </div>

      <div className="cards-section">
        <SectionBox 
          title="AI/ML"
          description="How I see AI/ML disrupting white collar work, and why that's a good thing."
          icon="brain"
          href="/ai"
        />
        <SectionBox 
          title="Medicine"
          description="Learn about how I plan to use tech to save lives."
          icon="medicine"
        />
        <SectionBox 
          title="Health"
          description="How I stay healthy and handsome"
          icon="stretch"
        />
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/ai" element={<AIPage />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App
