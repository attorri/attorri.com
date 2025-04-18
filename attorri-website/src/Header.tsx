import '../styles.css';

function Header() {
    return (
        <header className="top-nav" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(3, 27, 78, 0.1)',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            marginTop: '5px'
        }}>
            <div style={{
                maxWidth: '1400px',
                width: '100%',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 20px'
            }}>
                <a href="/" className="logo" style={{
                    color: 'var(--heading-color)',
                    textDecoration: 'none',
                    fontWeight: 500
                }}>
                    Chris Attorri
                </a>
                <nav className="nav-links" style={{
                    display: 'flex',
                    gap: '24px',
                    alignItems: 'center'
                }}>
                    <a href="#" className="nav-link" style={{
                        color: 'var(--text-color)',
                        textDecoration: 'none',
                        fontWeight: 500,
                        transition: 'color 0.2s ease'
                    }}>Documentation</a>
                    <a href="#" className="nav-link" style={{
                        color: 'var(--text-color)',
                        textDecoration: 'none',
                        fontWeight: 500,
                        transition: 'color 0.2s ease'
                    }}>About</a>
                    <a href="#" className="nav-link" style={{
                        color: 'var(--text-color)',
                        textDecoration: 'none',
                        fontWeight: 500,
                        transition: 'color 0.2s ease'
                    }}>Blog</a>
                    <a href="#" className="button-primary" style={{
                        background: 'var(--gradient-blue)',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: 500,
                        transition: 'transform 0.2s ease'
                    }}>Login/Signup</a>
                </nav>
            </div>
        </header>
    );
}

export default Header;