const router = require('express').Router()
const { query, getClient } = require('../db')
const { authenticate } = require('../auth')

// GET /api/applications
router.get('/', authenticate, async (req, res) => {
  const { lang = 'hi' } = req.query
  try {
    const result = await query(
      `SELECT a.id, a.application_number, a.status, a.current_step, a.created_at,
       s.name->>'${lang}' AS service_name 
       FROM applications a JOIN services s ON a.service_id = s.id
       WHERE a.user_id = $1 ORDER BY a.updated_at DESC`,
      [req.user.id]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/applications
router.post('/', authenticate, async (req, res) => {
  res.status(201).json({ message: 'Application created (mock)', service_id: req.body.service_id })
})

// Full impl later after DB
module.exports = router

