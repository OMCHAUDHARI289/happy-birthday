import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Welcome from './components/Welcome'
import MemoryLane from './components/MemoryLane'
import Slideshow from './components/Slideshow'
import CakeCutting from './components/CakeCutting'
import Greeting from './components/Greeting'
import MusicPlayer from './components/MusicPlayer'
import './index.css'

function App() {
  // State to track if user has entered through the welcome page
  const [hasStarted, setHasStarted] = useState(false)

  const startJourney = () => {
    setHasStarted(true)
  }

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Welcome onStart={startJourney} />} />
          <Route 
            path="/memory-lane" 
            element={hasStarted ? <MemoryLane /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/slideshow" 
            element={hasStarted ? <Slideshow /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/cake-cutting" 
            element={hasStarted ? <CakeCutting /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/greeting" 
            element={hasStarted ? <Greeting /> : <Navigate to="/" replace />} 
          />
        </Routes>
        
        {/* Music player that appears on all pages */}
        <MusicPlayer />
      </div>
    </Router>
  )
}

export default App
