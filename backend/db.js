const { Pool } = require('pg')

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     process.env.DB_PORT     || 5432,
  database: process.env.DB_NAME     || 'accessseva',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

pool.on('connect', () => console.log('Connected to PostgreSQL'))
pool.on('error',   (err) => console.error('DB error:', err))

// Helper: run a query with automatic error handling
const query = (text, params) => pool.query(text, params)

// Helper: get a client for transactions
const getClient = () => pool.connect()

module.exports = { query, getClient, pool }