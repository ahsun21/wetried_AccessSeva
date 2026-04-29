-- Run in Postgres: psql -d accessseva -f schema.sql

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  phone VARCHAR(10) UNIQUE,
  password_hash VARCHAR(255),
  district VARCHAR(50),
  state VARCHAR(50),
  preferred_lang VARCHAR(3) DEFAULT 'hi',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(50) UNIQUE,
  name JSONB,
  description JSONB,
  icon VARCHAR(10),
  category VARCHAR(50),
  total_steps INTEGER,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);

-- Insert sample services
INSERT INTO services (slug, name, icon, category, total_steps) VALUES
('ration-card', '{"hi":"राशन कार्ड","mr":"रेशनकार्ड","en":"Ration Card"}', '📄', 'essentials', 4),
('pm-awas', '{"hi":"PM आवास","mr":"PM आवास","en":"PM Awas"}', '🏠', 'housing', 6);

CREATE TABLE applications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  service_id INTEGER REFERENCES services(id),
  application_number VARCHAR(50) UNIQUE,
  status VARCHAR(20) DEFAULT 'pending',
  current_step INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

