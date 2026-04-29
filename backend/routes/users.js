const router = require('express').Router()
const { authenticate } = require('../auth')

router.get('/me', authenticate, async (req, res) => {
  res.json({ id: req.user.id, phone: req.user.phone })
})

module.exports = router

