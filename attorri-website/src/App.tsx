import { useState } from 'react'
import '../styles.css'
import './App.css'
import SectionBox from './SectionBox'

function App() {
  return (
    <div className="cards-section" style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '40px 20px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '32px',
      position: 'relative',
      zIndex: 2
    }}>
      <SectionBox 
        title="AI/ML"
        description="How I see AI/ML disrupting white collar work, and why that's a good thing."
      />
      <SectionBox 
        title="Medicine"
        description="Learn about my EMT/PA Dreams! Because, life is too short to not help people!"
      />
      <SectionBox 
        title="Health"
        description="How I stay healthy and handsome"
      />
    </div>
  )
}

export default App
