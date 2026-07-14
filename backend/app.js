require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('Admin Panel API is running...');
});

module.exports = app;
