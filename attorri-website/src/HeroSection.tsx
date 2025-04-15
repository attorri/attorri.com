import React from 'react';
import '../styles.css';

interface HeroSectionProps {
    title: [Array<string>, Record<string, string>];
    subtitle: string;
}

function HeroTitle(title: [Array<string>, Record<string, string>]) {
    const titleElements = title[0].map((word, index) => {
        if (word in title[1] && title[1][word] === 'gradient') {
            return (
                <span key={index} className="hero-title-part gradient" style={{
                    background: 'linear-gradient(135deg, #0069ff 0%, #00c7d8 50%, #0069ff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundSize: '200% 100%',
                    animation: 'gradientFlow 8s linear infinite'
                }}>{word} </span>
            );
        }
        return <span key={index} className="hero-title-part">{word} </span>;
    });

    return (
        <h1 style={{ 
            fontSize: '84px', 
            margin: '0 0 32px', 
            lineHeight: 1.1, 
            position: 'relative',
            color: 'var(--heading-color)'
        }}>
            {titleElements}
        </h1>
    );
}

function HeroSection({ title, subtitle }: HeroSectionProps) {
    return (
        <section className="hero-section" style={{
            maxWidth: '100%',
            margin: 0,
            padding: '160px 20px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #f8f9fc 0%, #eef2ff 100%)',
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
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
            <div style={{
                width: '100%',
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '0 20px',
                boxSizing: 'border-box',
                position: 'relative',
                zIndex: 2
            }}>
                {HeroTitle(title)}
                <p className="hero-subtitle" style={{
                    fontSize: '24px',
                    lineHeight: 1.6,
                    maxWidth: '800px',
                    margin: '32px auto 0',
                    color: 'var(--text-color)'
                }}>{subtitle}</p>
            </div>
        </section>
    );
}

export default HeroSection;
