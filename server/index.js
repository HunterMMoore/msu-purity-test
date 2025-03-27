const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.get('/questions', async (req, res) => {
    const { data, error } = await supabase.from('questions').select('*');
  
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }
  
    res.json(data);
  });

  app.post('/submit', async (req, res) => {
    const { score, answers } = req.body
  
    const { data, error } = await supabase
      .from('submissions')
      .insert([{ score, answers }])
  
    if (error) return res.status(500).json({ error })
    res.status(201).json({ message: 'Submission saved!' })
  })

  app.get('/stats', async (req, res) => {
    // 1. Get total tests and average score
    const { data: submissions, error: subError } = await supabase
      .from('submissions')
      .select('score, answers')
  
    if (subError) return res.status(500).json({ error: subError.message })
  
    const totalTests = submissions.length
    const averageScore = totalTests === 0
      ? 0
      : submissions.reduce((sum, s) => sum + s.score, 0) / totalTests
  
    // 2. Count per-question stats
    const questionCounts = {}
    submissions.forEach(sub => {
      Object.entries(sub.answers).forEach(([questionId, checked]) => {
        if (checked) {
          questionCounts[questionId] = (questionCounts[questionId] || 0) + 1
        }
      })
    })
  
    // 3. Get question text from `questions` table
    const { data: questions, error: qError } = await supabase
      .from('questions')
      .select('id, text')
  
    if (qError) return res.status(500).json({ error: qError.message })
  
    const enrichedQuestions = questions.map(q => {
      const count = questionCounts[q.id] || 0
      const percentage = totalTests === 0 ? 0 : (count / totalTests) * 100
      return {
        id: q.id,
        text: q.text,
        count,
        percentage
      }
    })
  
    res.json({
      totalTests,
      averageScore,
      questions: enrichedQuestions
    })
  })  
  
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
