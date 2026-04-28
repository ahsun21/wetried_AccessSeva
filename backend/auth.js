const jwt = require('jsonwebtoken')

const SECRET = process.env.JWT_SECRET || 'accessseva-secret-change-in-prod'

// Verify JWT token from Authorization header
function authenticate(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }
  const token = header.split(' ')[1]
  try {
    req.user = jwt.verify(token, SECRET)
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

// Optional auth — attaches user if token exists, doesn't fail if not
function optionalAuth(req, res, next) {
  const header = req.headers.authorization
  if (header && header.startsWith('Bearer ')) {
    try { req.user = jwt.verify(header.split(' ')[1], SECRET) } catch {}
  }
  next()
}

function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' })
}

module.exports = { authenticate, optionalAuth, signToken }