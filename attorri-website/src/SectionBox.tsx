import '../styles.css';

interface SectionBoxProps {
    title: string;
    description: string;
}

function SectionBox({ title, description }: SectionBoxProps) {
    return (
        <div className="feature-card" style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '16px',
            padding: '40px',
            border: '1px solid rgba(3, 27, 78, 0.1)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(3, 27, 78, 0.05)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            height: '100%'
        }}>
            <div className="card-icon" style={{
                color: 'var(--primary-blue)',
                marginBottom: '24px',
                fontSize: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center'
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" width="24" height="24" strokeWidth="2">
                    <path d="M15.5 13a3.5 3.5 0 0 0 -3.5 3.5v1a3.5 3.5 0 0 0 7 0v-1.8"></path>
                    <path d="M8.5 13a3.5 3.5 0 0 1 3.5 3.5v1a3.5 3.5 0 0 1 -7 0v-1.8"></path>
                    <path d="M17.5 16a3.5 3.5 0 0 0 0 -7h-.5"></path>
                    <path d="M19 9.3v-2.8a3.5 3.5 0 0 0 -7 0"></path>
                    <path d="M6.5 16a3.5 3.5 0 0 1 0 -7h.5"></path>
                    <path d="M5 9.3v-2.8a3.5 3.5 0 0 1 7 0v10"></path>
                </svg>
            </div>
            <h3 className="card-title" style={{
                fontSize: '24px',
                fontWeight: 600,
                color: 'var(--heading-color)',
                margin: '0 0 16px'
            }}>{title}</h3>
            <p className="card-description" style={{
                color: 'var(--text-color)',
                margin: '0',
                fontSize: '18px',
                flexGrow: 1,
                display: 'flex',
                alignItems: 'flex-start'
            }}>{description}</p>
            <a href="#" className="card-link" style={{
                display: 'inline-flex',
                alignItems: 'center',
                color: 'var(--primary-blue)',
                textDecoration: 'none',
                fontWeight: 500,
                transition: 'transform 0.2s ease',
                marginTop: '24px'
            }}>Learn more →</a>
        </div>
    )
}

export default SectionBox