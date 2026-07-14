const express    = require('express');
const router     = express.Router();
const { authenticate, adminOnly } = require('../middlewares/auth');
const { getAll, create, update, remove } = require('../controllers/produkController');

// GET    /api/products        → semua user login
// POST   /api/products        → admin only
// PUT    /api/products/:id    → admin only
// DELETE /api/products/:id    → admin only

router.get('/',     authenticate,             getAll);
router.post('/',    authenticate, adminOnly,  create);
router.put('/:id',  authenticate, adminOnly,  update);
router.delete('/:id', authenticate, adminOnly, remove);

module.exports = router;
