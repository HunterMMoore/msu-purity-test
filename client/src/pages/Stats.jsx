import { useEffect, useState } from 'react'
import axios from 'axios'
import './Pages.css'

function Stats() {
  const [totalTests, setTotalTests] = useState(0)
  const [averageScore, setAverageScore] = useState(0)
  const [questionStats, setQuestionStats] = useState([])

  useEffect(() => {
    axios.get('http://localhost:3001/stats').then(res => {
      setTotalTests(res.data.totalTests)
      setAverageScore(res.data.averageScore)
      setQuestionStats(res.data.questions)
    })
  }, [])

  return (
    <div className="page">
      <div className="card">
        <h2 className="title">MSU Purity Test Statistics</h2>

        <h3>Overall Statistics</h3>
        <p>Total Tests Taken: {totalTests}</p>
        <p>Average Score: {averageScore.toFixed(2)}</p>

        <h3>Question Statistics</h3>
        {questionStats.map((q, i) => (
          <div key={q.id} className="question-stat">
            <p><strong>{i + 1}. {q.text}</strong></p>
            <p>{q.count} people ({q.percentage.toFixed(1)}% of test takers)</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Stats
