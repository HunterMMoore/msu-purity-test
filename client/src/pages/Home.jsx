import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import './Pages.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL


function Home() {
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`${API_BASE_URL}/questions`).then(res => {
      setQuestions(res.data)
      const initialAnswers = {}
      res.data.forEach(q => { initialAnswers[q.id] = false })
      setAnswers(initialAnswers)
    })
  }, [])

  const handleChange = (id) => {
    setAnswers(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleSubmit = async () => {
    const checked = Object.values(answers).filter(v => v).length
    const purityScore = 100 - checked

    try {
      await axios.post(`${API_BASE_URL}/submit`, {
        score: purityScore,
        answers
      })
      navigate('/results', { state: { score: purityScore } })
    } catch (err) {
      toast.error('Failed to submit test')
    }
  }

  return (
    <div className="page">
      <div className="card">
      <div className="test-header">
  <div className="lines left-lines">
    <span className="official">The Official</span>
    <div className="line" />
    <div className="line" />
    <div className="line" />
  </div>
  
  <div className="title-wrapper">
    <span className="main-title">MSU Purity Test</span>
  </div>

  <div className="lines">
    <div className="line" />
    <div className="line" />
    <div className="line" />
  </div>
</div>

        <p className="description">
          The first ever MSU Purity Test. Serving as a way for students to bond and track their experiences throughout their time at Mississippi State University. It's a voluntary opportunity for students to reflect on their unique university journey.
        </p>
        <p className="caution">
          <strong>Caution: This is not a bucket list. You are beyond cooked if you complete all the items on this list.</strong>
        </p>
        <p className="instructions">
          Click on every item you have done. Your purity score will be calculated at the end.
        </p>

        <div className="questions">
          {questions.map((q, i) => (
            <label className="question" key={q.id}>
              <input
                type="checkbox"
                checked={answers[q.id] || false}
                onChange={() => handleChange(q.id)}
              />
              <span>{i + 1}. {q.text}</span>
            </label>
          ))}
        </div>

        <button className="submit-button" onClick={handleSubmit}>
          Calculate My Score
        </button>
      </div>
    </div>
  )
}

export default Home
