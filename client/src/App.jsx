import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'
import Results from './pages/Results'
import Stats from './pages/Stats'
import { Analytics } from "@vercel/analytics/react"
import './App.css'

function App() {
  return (
    <Router>
      {/* Toaster renders global notifications */}
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<Results />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </Router>
  )
}

export default App
