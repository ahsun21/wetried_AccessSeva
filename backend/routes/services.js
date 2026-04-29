const router = require('express').Router()
const { query } = require('../db')

router.get('/', async (req, res) => {
  const { lang = 'hi' } = req.query
  try {
    const result = await query(
      `SELECT id, slug, icon, name->>'${lang}' AS name, total_steps FROM services WHERE is_active = true ORDER BY sort_order`
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/:slug', async (req, res) => {
  const { lang = 'hi' } = req.query
  try {
    const result = await query(
      `SELECT * FROM services WHERE slug = $1`, [req.params.slug]
    )
    if (!result.rows.length) return res.status(404).json({ error: 'Service not found' })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router

