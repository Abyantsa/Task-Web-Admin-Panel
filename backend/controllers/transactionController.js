const { Transaction, Product, User, sequelize } = require('../models');

const createTransaction = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { items } = req.body; // items: [{ produk_id, qty }]
    const user_id = req.user.id;
    
    if (!items || items.length === 0) {
      await t.rollback();
      return res.status(400).json({ message: 'No items in transaction' });
    }
    
    const transactionsToCreate = [];
    
    for (const item of items) {
      const product = await Product.findByPk(item.produk_id, { transaction: t });
      
      if (!product) {
        await t.rollback();
        return res.status(404).json({ message: `Product not found` });
      }
      
      if (product.stok < item.qty) {
        await t.rollback();
        return res.status(400).json({ message: `Insufficient stock for product ${product.nama_produk}` });
      }
      
      const itemTotal = product.harga * item.qty;
      
      product.stok -= item.qty;
      await product.save({ transaction: t });
      
      transactionsToCreate.push({
        produk_id: product.id,
        user_id,
        qty: item.qty,
        total_harga: itemTotal,
        tanggal_transaksi: new Date()
      });
    }
    
    await Transaction.bulkCreate(transactionsToCreate, { transaction: t });
    
    await t.commit();
    res.status(201).json({ message: 'Transaction successful' });
  } catch (error) {
    await t.rollback();
    console.error('Transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      include: [
        { model: Product, as: 'produk' },
        { model: User, as: 'kasir', attributes: ['id', 'username'] }
      ],
      order: [['tanggal_transaksi', 'DESC'], ['id', 'DESC']]
    });
    res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createTransaction,
  getTransactions
};
