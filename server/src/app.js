// server/src/app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS (allow local dev)
app.use(
  cors({
    origin: true, // reflect origin
    credentials: true,
  })
);

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'Electronic Goods API' });
});

const mainRoutes = require('./routes/mainRoutes');
app.use('/api', mainRoutes);

module.exports = app;
