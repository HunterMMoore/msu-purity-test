import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import './Pages.css'

function Results() {
  const { score: scoreParam } = useParams()
  const navigate = useNavigate()

  const score = parseInt(scoreParam || '100', 10)

  const getMessage = (score) => {
    if (score >= 90) return "Go touch grass!"
    if (score >= 75) return "You should've just went to Ole Miss!"
    if (score >= 60) return "Go to the District right now!"
    if (score >= 40) return "Hail State!"
    if (score >= 20) return "You're a real dawg!"
    return "You may be a terrible person!"
  }

  const handleShare = async () => {
    const shareText = `My MSU Purity Score is ${score}/100 🤠

Take the test here: ${window.location.origin}/results/${score}`

    if (navigator.share) {
      try {
        await navigator.share({
          text: shareText
        })
      } catch (err) {
        console.log('Share cancelled', err)
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText)
        toast.success('Link copied to clipboard!')
      } catch (err) {
        toast.error('Failed to copy link')
      }
    }
  }

  return (
    <div className="page centered-page">
      <div className="card result-card">
        <div className="title">
          <span className="crossout">The Official</span> MSU Purity Test
        </div>
        <h2 className="score">Your MSU Purity Score: {score}</h2>
        <p className="message">{getMessage(score)}</p>

        <button className="submit-button" onClick={handleShare}>
          Share Result
        </button>

        <button className="alt-button" onClick={() => navigate('/')}>
          Take the test again
        </button>
      </div>
    </div>
  )
}

export default Results
