const express = require('express');
const cors = require('cors');
const analyzeRoutes = require('./routes/analyzeRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', analyzeRoutes);

module.exports = app;