const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middlewares/auth');

// Auth routes
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register); // For testing

// Protected routes below
router.use(authMiddleware);

// Products routes
router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', productController.createProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

// Transactions routes
router.get('/transactions', transactionController.getTransactions);
router.post('/transactions', transactionController.createTransaction);

module.exports = router;
