import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Message from './Message'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Message />
    </div>
  )
}

export default App
