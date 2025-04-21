require('dotenv').config();
const express = require('express');
const cors = require('cors');
const security = require('./middlewares/security');
const rateLimit = require('./middlewares/rateLimit');
const cache = require('./cache');
const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');
const teamRoutes = require('./routes/team');

const app = express();

// Clear cache for all admin routes
app.use('/admin', (req, res, next) => {
  console.log('Clearing cache for admin API hit...');
  cache.store.clear();
  next();
});

// Parse CORS origins from environment variable
const corsOrigins = process.env.CORS_ORIGINS ? 
  process.env.CORS_ORIGINS.split(',') : 
  ['http://localhost:3000']; // Fallback if env var is not set

// Replace the existing CORS middleware
app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10kb' }));
app.use(security.anonymizeIP);
app.use(security.sanitizeInput);
app.use(rateLimit.publicLimiter);

app.use('/api', publicRoutes);
app.use('/admin', adminRoutes);
app.use('/api/teams', teamRoutes);

app.use((req, res, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    cache.store.clear();
  }
  next();
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});