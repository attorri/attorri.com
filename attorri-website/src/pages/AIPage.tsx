import React from 'react';
import '../styles.css';
import gptRobots from '../assets/gpt_robots_2.png';
import HeroSection from '../HeroSection';

const AIPage: React.FC = () => {
    return (
        <div className="ai-page-container" style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            position: 'relative',
            background: 'var(--background-gradient)'
        }}>
            <div style={{ 
                width: '100%', 
                position: 'relative', 
                zIndex: 1,
                marginBottom: '120px' // Add margin to bottom of hero container
            }}>
                <HeroSection 
                    title={[
                        ['The', 'Automation', 'of', 'Work', 'as', 'we', 'know', 'it.'], 
                        {'Automation':'gradient', 'Work':'gradient'}
                    ]} 
                    subtitle="AI will fundamentally transform what it means to work. Here's a few stats I would use to describe its current state." 
                />
            </div>

            <div style={{ 
                position: 'relative', 
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: '40px',
                padding: '0 20px',
                marginTop: '40px' // Add top margin to content
            }}>
                {/* Stats Section */}
                <section className="content-section" style={{
                    padding: '80px 20px',
                    background: 'white',
                    borderRadius: '20px',
                    margin: '40px auto',
                    maxWidth: '1400px',
                    boxShadow: 'var(--card-shadow)'
                }}>
                    <h2 className="section-title" style={{
                        textAlign: 'center',
                        fontSize: '36px',
                        marginBottom: '40px'
                    }}>Key Statistics</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-number">#1</div>
                            <p>In analysis & pattern recognition</p>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">99.9%</div>
                            <p>Code/Natural Language Accuracy</p>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">100%</div>
                            <p>Guaranteed to be better than you</p>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="content-section" style={{
                    padding: '80px 20px',
                    background: 'white',
                    borderRadius: '20px',
                    margin: '40px auto',
                    maxWidth: '1400px',
                    boxShadow: 'var(--card-shadow)'
                }}>
                    <h2 className="section-title" style={{
                        textAlign: 'center',
                        fontSize: '36px',
                        marginBottom: '40px'
                    }}>Featured Content</h2>
                    <div className="feature-grid">
                        <div className="product-card">
                            <h3>AI in Repetitive Tasks</h3>
                            <p>View this week's post on how AI has been shown to be a disruptor.</p>
                            <a href="#" className="learn-more-link">Learn more</a>
                        </div>
                        <div className="product-card">
                            <h3>Vibe Coding</h3>
                            <p>View this week's code I made entirely with AI.</p>
                            <a href="#" className="learn-more-link">Learn more</a>
                        </div>
                        <div className="product-card">
                            <h3>Universally Beneficial Changes</h3>
                            <p>View this week's post on how these changes will benefit society.</p>
                            <a href="#" className="learn-more-link">Learn more</a>
                        </div>
                    </div>
                </section>

                {/* Robots Section */}
                <section className="content-section" style={{
                    padding: '80px 20px',
                    background: 'white',
                    borderRadius: '20px',
                    margin: '40px auto',
                    maxWidth: '1400px',
                    boxShadow: 'var(--card-shadow)'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '40px'
                    }}>
                        <div style={{ flex: 1 }}>
                            <h2 style={{ fontSize: '48px', color: 'var(--heading-color)', marginBottom: '24px' }}>Robots for Man</h2>
                            <p style={{ fontSize: '18px', color: 'var(--text-color)', lineHeight: 1.6 }}>
                                As an ML Engineer at CVS, I'll be creating numerous AI agents to help automate the work of the pharmacy.
                            </p>
                            <a href="#" className="learn-more-link" style={{ marginTop: '24px', display: 'inline-block' }}>Learn more</a>
                        </div>
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                            <img src={gptRobots} alt="robots" className="hero-image" style={{
                                width: '75%',
                                objectFit: 'cover',
                                borderRadius: '12px',
                                border: '1px solid rgba(99, 102, 241, 0.2)',
                                boxShadow: '0 4px 20px rgba(99, 102, 241, 0.1)'
                            }} />
                        </div>
                    </div>
                </section>

                {/* Applications Section */}
                <section className="content-section" style={{
                    padding: '80px 20px',
                    background: 'white',
                    borderRadius: '20px',
                    margin: '40px auto',
                    maxWidth: '1400px',
                    boxShadow: 'var(--card-shadow)'
                }}>
                    <h2 className="section-title" style={{
                        textAlign: 'center',
                        fontSize: '36px',
                        marginBottom: '40px'
                    }}>Basic AI Applications</h2>
                    <div className="stats-grid">
                        <button className="stat-card" style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}>
                            <div className="stat-number">YOLO</div>
                            <p>Object Recognition</p>
                        </button>
                        <div className="stat-card">
                            <div className="stat-number">CNN</div>
                            <p>Image Generation</p>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">$10T+</div>
                            <p>Business Opportunities</p>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">LLMs</div>
                            <p>Optimal Usage</p>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="content-section" style={{
                    padding: '80px 20px',
                    background: 'white',
                    borderRadius: '20px',
                    margin: '40px auto',
                    maxWidth: '1400px',
                    boxShadow: 'var(--card-shadow)'
                }}>
                    <h2 className="section-title" style={{
                        textAlign: 'center',
                        fontSize: '36px',
                        marginBottom: '40px'
                    }}>What leaders in the industry are saying</h2>
                    <div className="testimonial-grid">
                        <div className="testimonial-card">
                            <p className="quote">AI has completely transformed our development workflow. What used to take days now takes hours.</p>
                            <p className="author">Sarah Chen, Senior Developer</p>
                        </div>
                        <div className="testimonial-card">
                            <p className="quote">The code optimization suggestions have improved our app's performance by 40%. It's like having a senior architect available 24/7.</p>
                            <p className="author">Michael Rodriguez, Tech Lead</p>
                        </div>
                        <div className="testimonial-card">
                            <p className="quote">The future of coding is here. AI doesn't just write code - it understands context and business logic.</p>
                            <p className="author">Alex Thompson, CTO</p>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="cta-section">
                    <div className="cta-content">
                        <h2>Curious to learn more?</h2>
                        <p>Join our newsletter to get the latest updates on me and my interests. I'm making sweeping changes to my life and I'd love to have you along for the ride.</p>
                        <a href="#" className="cta-button-white">Get Plugged In Now</a>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AIPage; 