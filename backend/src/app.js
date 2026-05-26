const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const ticketRoutes = require('./routes/ticketRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Global middleware
app.use(helmet());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}
app.use(express.json({ limit: '1mb' }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// API routes
app.use('/api/tickets', ticketRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
