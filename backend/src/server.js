import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import pool, { initializeDatabase } from './config/database.js';
import transactionRoutes from './routes/transactions.js';
import settingsRoutes from './routes/settings.js';
import { getBalance, getCurrentMonthStats } from './controllers/transactionController.js';

// Load environment variables
dotenv.config();

// Debug: Log environment variables (without sensitive data)
console.log('Environment check:');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('- PORT:', process.env.PORT || '3000 (default)');
console.log('- DATABASE_URL:', process.env.DATABASE_URL ? 'SET (hidden)' : 'NOT SET');
console.log('- FRONTEND_URL:', process.env.FRONTEND_URL || 'not set');

const app = express();
const httpServer = createServer(app);

// Allowed origins for CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
  'https://viajes-martha.vercel.app'
].filter(Boolean);

// Configure Socket.io with CORS
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Allow anyway in production for now
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint (doesn't require DB)
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'taxi-martha-backend',
    database_url_configured: !!process.env.DATABASE_URL
  });
});

// API Routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/settings', settingsRoutes);

// Stats Routes
app.get('/api/stats/balance', getBalance);
app.get('/api/stats/current-month', getCurrentMonthStats);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Make io instance available to routes (attach to app)
app.set('io', io);

// Initialize database and start server
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  // Start HTTP server first (so Railway knows it's alive)
  httpServer.listen(PORT, '0.0.0.0', async () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Taxi Martha Backend Server');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Now try to initialize database
    try {
      await initializeDatabase();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization failed:', error.message);
      console.error('The server will continue running but database operations will fail');
      console.error('Make sure DATABASE_URL is set correctly in Railway');
    }
  });
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  httpServer.close(() => {
    console.log('HTTP server closed');
  });
  await pool.end();
  process.exit(0);
});

startServer();

export { io };
