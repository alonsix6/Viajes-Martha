import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// PostgreSQL connection pool
// Supports both DATABASE_URL (Railway/Heroku) and individual env vars
const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || 'taxi_martha',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    };

console.log('Database config:', {
  using_database_url: !!process.env.DATABASE_URL,
  ssl_enabled: process.env.NODE_ENV === 'production'
});

const pool = new Pool(poolConfig);

// Log connection events
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Database pool error:', err.message);
  // Don't exit - let the application handle errors gracefully
});

// Database schema initialization (run manually or on first startup)
export const initializeDatabase = async () => {
  if (!process.env.DATABASE_URL && !process.env.DB_HOST) {
    console.warn('WARNING: No database configuration found!');
    console.warn('Set DATABASE_URL (for Railway) or individual DB_* variables');
    throw new Error('Database not configured');
  }

  let client;
  try {
    client = await pool.connect();
    console.log('Database connection successful');

    // Create transactions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        type VARCHAR(10) NOT NULL CHECK (type IN ('ingreso', 'gasto')),
        amount DECIMAL(10, 2) NOT NULL,
        description TEXT,
        category VARCHAR(50),
        date TIMESTAMP NOT NULL DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create settings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        pin VARCHAR(6) NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Insert default PIN if settings table is empty
    await client.query(`
      INSERT INTO settings (pin)
      SELECT '123456'
      WHERE NOT EXISTS (SELECT 1 FROM settings);
    `);

    console.log('Database schema initialized');
  } catch (error) {
    console.error('Error initializing database:', error.message);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
};

export default pool;
