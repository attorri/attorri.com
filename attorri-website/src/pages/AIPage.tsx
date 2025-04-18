import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';
import gptRobots from '../assets/gpt_robots_2.png';
import HeroSection from '../HeroSection';
import ProductCard from '../ProductCard';
import StatCard from '../StatCard';

const AIPage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Initialize GSAP animations
        const gsap = (window as any).gsap;
        if (gsap) {
            gsap.to('.ai-hero-title', {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "back.out(1.2)"
            });

            gsap.to('.ai-hero-subtitle', {
                opacity: 1,
                y: 0,
                duration: 1,
                delay: 0.3,
                ease: "power3.out"
            });
        }
    }, []);

    const handleYoloClick = () => {
        navigate('/yolo');
    };

    const handleStabilityClick = () => {
        navigate('/stability');
    };

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
            }}>
                <HeroSection 
                    title={[
                        ['The', 'Automation', 'of', 'Work', 'as', 'we', 'know', 'it.'], 
                        {'Automation':'gradient', 'Work':'gradient'}
                    ]} 
                    subtitle="AI will fundamentally transform what it means to work. Here's a few stats I would use to describe its current state." 
                    className="ai"
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
                        <StatCard value="#1" title="In analysis & pattern recognition" />
                        <StatCard value="99.9%" title="Code/Natural Language Accuracy" />
                        <StatCard value="100%" title="Guaranteed to be better than you" />
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
                        <ProductCard title="AI in Repetitive Tasks" description="View this week's post on how AI has been shown to be a disruptor." />
                        <ProductCard title="Vibe Coding" description="View this week's code I made entirely with AI." />
                        <ProductCard title="Universal Benefits" description="View this week's post on how these changes will benefit society." />
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
                        <div onClick={handleYoloClick} style={{ cursor: 'pointer' }}>
                            <StatCard value="YOLO" title="Object Recognition" />
                        </div>
                        <div onClick={handleStabilityClick} style={{ cursor: 'pointer' }}>
                            <StatCard value="Stability" title="Image Generation" />
                        </div>
                        <StatCard value="LLMs" title="Optimal Usage" />
                        <StatCard value="$10T+" title="Business Opportunities" />
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
            </div>
        </div>
    );
};

export default AIPage; 