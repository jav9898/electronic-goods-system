const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Electronic Goods System API',
    status: 'Server running successfully'
  });
});

// TODO: Routes will be added here as features are developed
// app.use('/api', itemRoutes);

const mainRoutes = require('./routes/mainRoutes');
app.use("/api", mainRoutes); 
//app.use("/", mainRoutes);

module.exports = app;
