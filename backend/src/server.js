const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const eventsRoutes = require('./routes/events');
const slotsRoutes = require('./routes/slots');
const inquiriesRoutes = require('./routes/inquiries');
const availabilityRoutes = require('./routes/availability');
const webhooksRoutes = require('./routes/webhooks');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'ArtistFlow API is running', version: '1.0.0' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/slots', slotsRoutes);
app.use('/api/inquiries', inquiriesRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/webhooks', webhooksRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`ArtistFlow API server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
