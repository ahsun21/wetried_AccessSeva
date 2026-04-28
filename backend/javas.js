const router = require('express').Router()
const { query, getClient } = require('../db')
const { authenticate } = require('../middleware/auth')
const { v4: uuidv4 } = require('uuid')

// GET /api/applications  — list user's applications
router.get('/', authenticate, async (req, res) => {
  const { lang = 'hi' } = req.query
  try {
    const result = await query(
      `SELECT a.id, a.application_number, a.status, a.current_step, a.created_at, a.updated_at,
              s.name->>'${lang}' AS service_name, s.total_steps, s.icon
       FROM applications a
       JOIN services s ON a.service_id = s.id
       WHERE a.user_id = $1
       ORDER BY a.updated_at DESC`,
      [req.user.id]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/applications  — start a new application
router.post('/', authenticate, async (req, res) => {
  const { service_id } = req.body
  if (!service_id) return res.status(400).json({ error: 'service_id required' })

  const client = await getClient()
  try {
    await client.query('BEGIN')

    // Check for existing in-progress application
    const existing = await client.query(
      `SELECT id FROM applications WHERE user_id=$1 AND service_id=$2 AND status NOT IN ('approved','rejected')`,
      [req.user.id, service_id]
    )
    if (existing.rows.length) {
      await client.query('ROLLBACK')
      return res.status(409).json({ error: 'Application already in progress', id: existing.rows[0].id })
    }

    const appNumber = `APP-${new Date().getFullYear()}-${uuidv4().slice(0,6).toUpperCase()}`
    const result = await client.query(
      `INSERT INTO applications (user_id, service_id, application_number, status, current_step)
       VALUES ($1,$2,$3,'pending',1) RETURNING *`,
      [req.user.id, service_id, appNumber]
    )

    // Create step_progress rows
    const svc = await client.query('SELECT total_steps FROM services WHERE id=$1', [service_id])
    const totalSteps = svc.rows[0]?.total_steps || 4
    for (let i = 1; i <= totalSteps; i++) {
      await client.query(
        `INSERT INTO application_steps (application_id, step_number, status)
         VALUES ($1,$2,$3)`,
        [result.rows[0].id, i, i === 1 ? 'in_progress' : 'pending']
      )
    }

    await client.query('COMMIT')
    res.status(201).json(result.rows[0])
  } catch (err) {
    await client.query('ROLLBACK')
    res.status(500).json({ error: err.message })
  } finally {
    client.release()
  }
})

// PATCH /api/applications/:id/step  — advance to next step
router.patch('/:id/step', authenticate, async (req, res) => {
  const { id } = req.params
  const client = await getClient()
  try {
    await client.query('BEGIN')
    const app = await client.query(
      'SELECT * FROM applications WHERE id=$1 AND user_id=$2 FOR UPDATE',
      [id, req.user.id]
    )
    if (!app.rows.length) return res.status(404).json({ error: 'Not found' })

    const { current_step } = app.rows[0]
    const svc = await client.query('SELECT total_steps FROM services WHERE id=$1', [app.rows[0].service_id])
    const totalSteps = svc.rows[0].total_steps

    // Mark current step done
    await client.query(
      `UPDATE application_steps SET status='completed', completed_at=NOW()
       WHERE application_id=$1 AND step_number=$2`,
      [id, current_step]
    )

    const nextStep = current_step + 1
    let newStatus = 'processing'
    if (nextStep > totalSteps) newStatus = 'submitted'

    await client.query(
      `UPDATE applications SET current_step=$1, status=$2, updated_at=NOW() WHERE id=$3`,
      [Math.min(nextStep, totalSteps), newStatus, id]
    )

    if (nextStep <= totalSteps) {
      await client.query(
        `UPDATE application_steps SET status='in_progress' WHERE application_id=$1 AND step_number=$2`,
        [id, nextStep]
      )
    }

    await client.query('COMMIT')
    const updated = await query('SELECT * FROM applications WHERE id=$1', [id])
    res.json(updated.rows[0])
  } catch (err) {
    await client.query('ROLLBACK')
    res.status(500).json({ error: err.message })
  } finally {
    client.release()
  }
})

// GET /api/applications/:id  — get single application with steps
router.get('/:id', authenticate, async (req, res) => {
  try {
    const app = await query(
      `SELECT a.*, s.name AS service_name, s.total_steps, s.icon
       FROM applications a JOIN services s ON a.service_id=s.id
       WHERE a.id=$1 AND a.user_id=$2`,
      [req.params.id, req.user.id]
    )
    if (!app.rows.length) return res.status(404).json({ error: 'Not found' })

    const steps = await query(
      'SELECT * FROM application_steps WHERE application_id=$1 ORDER BY step_number',
      [req.params.id]
    )
    res.json({ ...app.rows[0], steps: steps.rows })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router