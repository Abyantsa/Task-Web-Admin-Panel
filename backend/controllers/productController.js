const { Product } = require('../models');

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { nama_produk, harga, stok } = req.body;
    const product = await Product.create({ nama_produk, harga, stok });
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { nama_produk, harga, stok } = req.body;
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    product.nama_produk = nama_produk;
    product.harga = harga;
    product.stok = stok;
    await product.save();
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
