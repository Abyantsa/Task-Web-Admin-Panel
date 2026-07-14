const express    = require('express');
const router     = express.Router();
const { authenticate } = require('../middlewares/auth');
const { getAll, create } = require('../controllers/transaksiController');

// GET  /api/transactions   → semua user login
// POST /api/transactions   → semua user login (kasir & admin)

router.get('/',  authenticate, getAll);
router.post('/', authenticate, create);

module.exports = router;
