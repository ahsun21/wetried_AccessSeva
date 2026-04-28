const router = require('express').Router()
const { query } = require('../db')

// GET /api/services  — list all services, optionally filtered by lang
router.get('/', async (req, res) => {
  const { lang = 'hi', category } = req.query
  try {
    let sql = `SELECT id, slug, icon, category, 
                 name->>'${lang}' AS name,
                 description->>'${lang}' AS description,
                 total_steps
               FROM services WHERE is_active = true`
    const params = []
    if (category) { sql += ` AND category = $1`; params.push(category) }
    sql += ' ORDER BY sort_order ASC'
    const result = await query(sql, params)
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/services/:slug  — get single service with all steps
router.get('/:slug', async (req, res) => {
  const { lang = 'hi' } = req.query
  const { slug } = req.params
  try {
    const svc = await query(
      `SELECT id, slug, icon, category, name->>'${lang}' AS name, 
              description->>'${lang}' AS description, total_steps, eligibility
       FROM services WHERE slug = $1 AND is_active = true`,
      [slug]
    )
    if (!svc.rows.length) return res.status(404).json({ error: 'Service not found' })

    const steps = await query(
      `SELECT step_number, 
              title->>'${lang}' AS title,
              subtitle->>'${lang}' AS subtitle,
              instructions->>'${lang}' AS instructions,
              required_docs, tip->>'${lang}' AS tip
       FROM service_steps WHERE service_id = $1 ORDER BY step_number ASC`,
      [svc.rows[0].id]
    )
    res.json({ ...svc.rows[0], steps: steps.rows })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router