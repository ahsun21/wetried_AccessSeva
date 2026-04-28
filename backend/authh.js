const router   = require('express').Router()
const bcrypt   = require('bcryptjs')
const { body, validationResult } = require('express-validator')
const { query } = require('../db')
const { signToken, authenticate } = require('../middleware/auth')

// POST /api/auth/register
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone').matches(/^[6-9]\d{9}$/).withMessage('Valid Indian phone number required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('district').notEmpty().withMessage('District is required'),
  body('state').notEmpty().withMessage('State is required'),
  body('preferred_lang').isIn(['hi','mr','en']).withMessage('Language must be hi, mr or en'),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  const { name, phone, password, district, state, preferred_lang } = req.body
  try {
    const exists = await query('SELECT id FROM users WHERE phone = $1', [phone])
    if (exists.rows.length) return res.status(409).json({ error: 'Phone already registered' })

    const hash = await bcrypt.hash(password, 10)
    const result = await query(
      `INSERT INTO users (name, phone, password_hash, district, state, preferred_lang)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, name, phone, district, state, preferred_lang`,
      [name, phone, hash, district, state, preferred_lang]
    )
    const user = result.rows[0]
    const token = signToken({ id: user.id, phone: user.phone })
    res.status(201).json({ user, token })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/auth/login
router.post('/login', [
  body('phone').notEmpty(),
  body('password').notEmpty(),
], async (req, res) => {
  const { phone, password } = req.body
  try {
    const result = await query('SELECT * FROM users WHERE phone = $1', [phone])
    if (!result.rows.length) return res.status(401).json({ error: 'Invalid credentials' })

    const user = result.rows[0]
    const match = await bcrypt.compare(password, user.password_hash)
    if (!match) return res.status(401).json({ error: 'Invalid credentials' })

    const token = signToken({ id: user.id, phone: user.phone })
    const { password_hash, ...safeUser } = user
    res.json({ user: safeUser, token })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
  try {
    const result = await query(
      'SELECT id, name, phone, district, state, preferred_lang, created_at FROM users WHERE id = $1',
      [req.user.id]
    )
    res.json(result.rows[0] || {})
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router