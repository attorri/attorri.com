import React from 'react';
import '../styles.css';
import gptRobots from '../assets/gpt_robots_2.png';


const AIPage: React.FC = () => {
    return (
        <div className="ai-page-container">
            <main>
                <div className="ai-hero-container" style={{
                    maxWidth: '100%',
                    margin: 0,
                    padding: '120px 20px',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #f8f9fc 0%, #eef2ff 100%)'
                }}>
                    <div className="blue-orb orb-1" style={{
                        position: 'absolute',
                        width: '1200px',
                        height: '1200px',
                        background: 'linear-gradient(135deg, rgba(0, 105, 255, 0.1) 0%, rgba(0, 199, 216, 0.1) 100%)',
                        filter: 'blur(150px)',
                        opacity: 0.5,
                        borderRadius: '50%',
                        zIndex: 1,
                        pointerEvents: 'none',
                        top: '-600px',
                        right: '-300px',
                        animation: 'floatOrb 20s infinite alternate ease-in-out'
                    }}></div>
                    <div className="blue-orb orb-2" style={{
                        position: 'absolute',
                        width: '800px',
                        height: '800px',
                        background: 'linear-gradient(135deg, rgba(0, 105, 255, 0.1) 0%, rgba(0, 199, 216, 0.1) 100%)',
                        filter: 'blur(150px)',
                        opacity: 0.3,
                        borderRadius: '50%',
                        zIndex: 1,
                        pointerEvents: 'none',
                        bottom: '-400px',
                        left: '-300px',
                        animation: 'floatOrb 15s infinite alternate-reverse ease-in-out'
                    }}></div>
                    <div className="floating-elements" style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        top: 0,
                        left: 0,
                        pointerEvents: 'none',
                        zIndex: 1
                    }}>
                        <div className="floating-element" style={{
                            position: 'absolute',
                            width: '300px',
                            height: '300px',
                            top: '10%',
                            right: '-150px',
                            background: 'var(--gradient-blue)',
                            borderRadius: '50%',
                            opacity: 0.1,
                            filter: 'blur(20px)'
                        }}></div>
                        <div className="floating-element" style={{
                            position: 'absolute',
                            width: '200px',
                            height: '200px',
                            bottom: '20%',
                            left: '-100px',
                            background: 'var(--gradient-blue)',
                            borderRadius: '50%',
                            opacity: 0.1,
                            filter: 'blur(20px)'
                        }}></div>
                    </div>
                    <div className="hero-content" style={{
                        maxWidth: '1400px',
                        margin: '0 auto',
                        position: 'relative',
                        zIndex: 2
                    }}>
                        <h1 style={{ fontSize: '84px', margin: '0 0 32px', lineHeight: 1.1, position: 'relative' }}>
                            <span className="hero-title-part">The </span>
                            <span className="hero-title-part gradient" style={{
                                background: 'linear-gradient(135deg, #0069ff 0%, #00c7d8 50%, #0069ff 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundSize: '200% 100%',
                                animation: 'gradientFlow 8s linear infinite'
                            }}>Automation</span>
                            <span className="hero-title-part">of</span>
                            <span className="hero-title-part gradient" style={{
                                background: 'linear-gradient(135deg, #0069ff 0%, #00c7d8 50%, #0069ff 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundSize: '200% 100%',
                                animation: 'gradientFlow 8s linear infinite'
                            }}>Work</span>
                            <span className="hero-title-part">as we know it.</span>
                        </h1>
                        <p className="subtitle" style={{
                            fontSize: '32px',
                            lineHeight: 1.4,
                            color: 'var(--text-color)',
                            maxWidth: '900px',
                            margin: '32px auto 64px'
                        }}>
                            AI will fundamentally transform what it means to work. Here's a few stats I would use to describe its current state.
                        </p>

                        <div className="stats-grid" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '24px',
                            marginTop: '48px'
                        }}>
                            <div className="stat-card" style={{
                                background: 'rgba(255, 255, 255, 0.9)',
                                padding: '32px',
                                borderRadius: '16px',
                                textAlign: 'center'
                            }}>
                                <div className="stat-number" style={{
                                    background: 'linear-gradient(135deg, #6366f1 0%, #a78bfa 50%, #8b5cf6 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>#1</div>
                                <p>In analysis & pattern recognition</p>
                            </div>
                            <div className="stat-card" style={{
                                background: 'rgba(255, 255, 255, 0.9)',
                                padding: '32px',
                                borderRadius: '16px',
                                textAlign: 'center'
                            }}>
                                <div className="stat-number" style={{
                                    background: 'linear-gradient(135deg, #6366f1 0%, #a78bfa 50%, #8b5cf6 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>99.9%</div>
                                <p>Code/Natural Language Accuracy</p>
                            </div>
                            <div className="stat-card" style={{
                                background: 'rgba(255, 255, 255, 0.9)',
                                padding: '32px',
                                borderRadius: '16px',
                                textAlign: 'center'
                            }}>
                                <div className="stat-number" style={{
                                    background: 'linear-gradient(135deg, #6366f1 0%, #a78bfa 50%, #8b5cf6 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>100%</div>
                                <p>Guaranteed to be better than you</p>
                            </div>
                        </div>

                        <div className="feature-grid" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '32px',
                            marginTop: '80px'
                        }}>
                            <div className="product-card" style={{
                                background: 'white',
                                padding: '32px',
                                borderRadius: '12px',
                                boxShadow: 'var(--card-shadow)'
                            }}>
                                <h3>AI in Repetitive Tasks</h3>
                                <p>View this week's post on how AI has been shown to be a disruptor.</p>
                                <a href="#" className="learn-more-link">Learn more</a>
                            </div>
                            <div className="product-card" style={{
                                background: 'white',
                                padding: '32px',
                                borderRadius: '12px',
                                boxShadow: 'var(--card-shadow)'
                            }}>
                                <h3>Vibe Coding</h3>
                                <p>View this week's code I made entirely with AI.</p>
                                <a href="#" className="learn-more-link">Learn more</a>
                            </div>
                            <div className="product-card" style={{
                                background: 'white',
                                padding: '32px',
                                borderRadius: '12px',
                                boxShadow: 'var(--card-shadow)'
                            }}>
                                <h3>Universally Beneficial Changes</h3>
                                <p>View this week's post on how these changes will benefit society.</p>
                                <a href="#" className="learn-more-link">Learn more</a>
                            </div>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: 'white',
                            borderRadius: '16px',
                            padding: '40px',
                            marginTop: '80px',
                            boxShadow: 'var(--card-shadow)',
                            border: '2px solid rgba(99, 102, 241, 0.1)'
                        }}>
                            <div style={{ flex: 1, paddingRight: '40px' }}>
                                <h2 style={{ fontSize: '48px', color: 'var(--heading-color)', marginBottom: '24px' }}>Robots for Man</h2>
                                <p style={{ fontSize: '18px', color: 'var(--text-color)', lineHeight: 1.6 }}>
                                    As an ML Enginer at CVS, I'll be creating numerous AI agents to help automate the work of the pharmacy.
                                </p>
                                <a href="#" className="learn-more-link" style={{ marginTop: '24px', display: 'inline-block' }}>Learn more</a>
                            </div>
                            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                                <img src={gptRobots} alt="robots" className="hero-image" style={{
                                    width: '75%',
                                    height: '75%',
                                    objectPosition: 'center',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(99, 102, 241, 0.2)',
                                    boxShadow: '0 4px 20px rgba(99, 102, 241, 0.1)'
                                }} />
                            </div>
                        </div>
                    </div>
                </div>

                <section className="stats-section" style={{
                    background: 'linear-gradient(135deg, rgba(0, 105, 255, 0.03) 0%, rgba(0, 199, 216, 0.03) 100%)',
                    padding: '80px 20px',
                    margin: '60px 0',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <h2 className="section-title">Basic AI Applications</h2>
                    <div className="stats-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '24px',
                        margin: '0 auto',
                        maxWidth: '1200px',
                        padding: '0 20px'
                    }}>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                            <div className="stat-card">
                                <div className="stat-number">YOLO</div>
                                <p>Object Recognition</p>
                            </div>
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

                <section className="testimonials" style={{
                    maxWidth: '1200px',
                    margin: '80px auto',
                    padding: '0 20px'
                }}>
                    <h2 className="section-title">What leaders in the industry are saying</h2>
                    <div className="testimonial-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '32px'
                    }}>
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

                <section className="cta-section" style={{
                    background: 'var(--gradient-blue)',
                    padding: '80px 20px',
                    textAlign: 'center',
                    color: 'white',
                    marginTop: '80px'
                }}>
                    <div className="cta-content" style={{
                        maxWidth: '800px',
                        margin: '0 auto'
                    }}>
                        <h2>Curious to learn more?</h2>
                        <p>Join our newsletter to get the latest updates on me and my interests. I'm making sweeping changes to my life and I'd love to have you along for the ride.</p>
                        <a href="#" className="cta-button-white" style={{
                            display: 'inline-block',
                            background: 'white',
                            color: 'var(--primary-blue)',
                            padding: '16px 32px',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            fontWeight: 600,
                            marginTop: '32px'
                        }}>Get Plugged In Now</a>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AIPage; 