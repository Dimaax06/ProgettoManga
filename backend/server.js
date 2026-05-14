require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const { initializeDatabase } = require('./src/config/initDb');

const authRoutes = require('./src/routes/auth');
const mangaRoutes = require('./src/routes/manga');
const reviewRoutes = require('./src/routes/reviews');
const favoriteRoutes = require('./src/routes/favorites');
const adminRoutes = require('./src/routes/admin');
const userRoutes = require('./src/routes/users');

// --- Critical env validation with safe fallbacks ---
if (!process.env.JWT_SECRET) {
  console.warn('\n⚠️  JWT_SECRET not set in .env — using insecure development fallback.');
  console.warn('   Generate a secure one: openssl rand -hex 64\n');
  process.env.JWT_SECRET = 'dev-only-insecure-jwt-secret-' + Date.now();
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}));
app.use(cors({
  origin: process.env.CORS_ORIGIN || true,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Stricter limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Too many authentication attempts, please wait 15 minutes.' },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/manga', mangaRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', async (req, res) => {
  const db = require('./src/config/database');
  try {
    await db.query('SELECT 1');
    res.json({ status: 'ok', platform: 'DiMangaX', db: 'connected' });
  } catch (err) {
    res.status(503).json({ status: 'degraded', platform: 'DiMangaX', db: 'disconnected', error: err.message });
  }
});

// 404 handler for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global error handler — never leak stack traces
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.stack || err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { details: err.stack }),
  });
});

async function start() {
  console.log('\n🔥 DiMangaX API starting...\n');
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`\n✅ DiMangaX API running on http://localhost:${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
  });
}

start().catch(err => {
  console.error('❌ Fatal startup error:', err);
  process.exit(1);
});

module.exports = app;
