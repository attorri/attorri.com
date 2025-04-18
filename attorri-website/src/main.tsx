import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import '../styles.css'
import App from './App'
import Header from './Header'

const MainContainer = () => (
  <div style={{ 
    width: '100%',
    minHeight: '100vh',
    paddingTop: '80px' // Account for fixed header
  }}>
    <Header />
    <App />
  </div>
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainContainer />
  </StrictMode>,
)
