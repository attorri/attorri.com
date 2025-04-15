import React from 'react';
import '../styles.css';

interface StatCardProps {
    title: string;
    value: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
    return (
        <div className="stat-card hover-gradient" style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: 'clamp(24px, 4vw, 40px)',
            textAlign: 'center',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 'clamp(160px, 15vw, 200px)',
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            border: '1px solid rgba(99, 102, 241, 0.1)',
            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.1)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div className="stat-number" style={{
                fontSize: 'clamp(36px, 5vw, 64px)',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #6366f1 0%, #a78bfa 50%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: 'clamp(12px, 2vw, 20px)',
                lineHeight: 1,
                letterSpacing: '-0.02em',
                whiteSpace: 'nowrap'
            }}>
                {value}
            </div>
            <p style={{
                fontSize: 'clamp(16px, 2vw, 20px)',
                color: 'var(--text-color)',
                margin: 0,
                maxWidth: '100%',
                lineHeight: 1.4,
                fontWeight: 500
            }}>
                {title}
            </p>
        </div>
    );
};

export default StatCard;   