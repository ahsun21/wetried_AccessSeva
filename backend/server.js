require('dotenv').config()
const express  = require('express')
const cors     = require('cors')
const helmet   = require('helmet')
const morgan   = require('morgan')

const authRoutes     = require('./routes/auth')
const serviceRoutes  = require('./routes/services')
const applicationRoutes = require('./routes/applications')
const documentRoutes = require('./routes/documents')
const voiceRoutes    = require('./routes/voice')
const userRoutes     = require('./routes/users')

const app  = express()
const PORT = process.env.PORT || 4000

// ===== Middleware =====
app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }))
app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static('uploads'))

// ===== Routes =====
app.use('/api/auth',         authRoutes)
app.use('/api/services',     serviceRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/documents',    documentRoutes)
app.use('/api/voice',        voiceRoutes)
app.use('/api/users',        userRoutes)

// ===== Health check =====
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }))

// ===== Error handler =====
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

app.listen(PORT, () => console.log(`AccessSeva backend running on port ${PORT}`))
module.exports = app