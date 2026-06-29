require('dotenv').config();
/**
 * JeevanSetu Backend Server
 * Entry point - starts Express, mounts all routes, seeds DB.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const config = require('./config');
const connectDB = require('./config/db.mongoose');
const seed = require('./database/seed');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const chatRoutes = require('./routes/chat');
const reportRoutes = require('./routes/reports');
const verificationRoutes = require('./routes/verification');
const farmerRoutes = require('./routes/farmer');
const notificationRoutes = require('./routes/notifications');
const reviewRoutes = require('./routes/reviews');
const schemesRoutes = require('./routes/schemes');

const app = express();

// ─── Middleware ──────────────────────────────────────────────────
app.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists
const uploadsDir = path.resolve(__dirname, config.UPLOAD_DIR);
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// ─── API Routes ─────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/farmer', farmerRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/schemes', schemesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'JeevanSetu API is running', timestamp: new Date().toISOString() });
});

// ─── Error Handling ─────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ─── Start Server ───────────────────────────────────────────────
connectDB(); // Initialize Mongoose connection
seed(); // Seed database with initial data

app.listen(config.PORT, () => {
  console.log(`\n  JeevanSetu Backend API`);
  console.log(`  ─────────────────────`);
  console.log(`  Local:   http://localhost:${config.PORT}`);
  console.log(`  Health:  http://localhost:${config.PORT}/api/health`);
  console.log(`  CORS:    ${config.CORS_ORIGIN}\n`);
});
