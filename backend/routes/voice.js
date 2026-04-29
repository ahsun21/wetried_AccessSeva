const router = require('express').Router()

const MOCK_RESPONSES = {
  hi: 'राशन कार्ड के लिए आधार, बिजली बिल, परिवार विवरण चाहिए। 30 दिन में कार्ड मिलेगा।',
  mr: 'रेशनकार्डसाठी आधार, वीज बिल, कुटुंब माहिती. ३० दिवसात कार्ड मिळेल.',
  en: 'For ration card: Aadhar, electricity bill, family details needed. Card in 30 days.'
}

// POST /api/voice/query
router.post('/query', (req, res) => {
  const { question, lang = 'hi' } = req.body
  // Mock - replace with AI/NLP later
  const answer = MOCK_RESPONSES[lang] || MOCK_RESPONSES.en
  res.json({ answer, confidence: 0.95, sources: ['gov.in schemes'] })
})

module.exports = router

