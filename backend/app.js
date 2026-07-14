const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const authRoutes     = require('./routes/authRoutes');
const produkRoutes   = require('./routes/produkRoutes');
const transaksiRoutes = require('./routes/transaksiRoutes');

const app = express();

// --- Middleware global ---
app.use(cors());
app.use(express.json());

// --- Routes ---
app.use('/api/auth',         authRoutes);
app.use('/api/products',     produkRoutes);
app.use('/api/transactions', transaksiRoutes);



// --- 404 handler ---
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} tidak ditemukan` });
});

// --- Global error handler ---
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
});

module.exports = app;
