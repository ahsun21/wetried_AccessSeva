const jwt = require('jsonwebtoken')

const SECRET = process.env.JWT_SECRET || 'accessseva-secret'

function authenticate(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token' })
  }
  try {
    req.user = jwt.verify(header.split(' ')[1], SECRET)
    next()
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' })
  }
}

function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' })
}

module.exports = { authenticate, signToken }

