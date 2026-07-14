const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Product = require('./Product');

const Transaction = sequelize.define('Transaction', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tanggal_transaksi: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
  produk_id: { type: DataTypes.INTEGER, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  qty: { type: DataTypes.INTEGER, allowNull: false },
  total_harga: { type: DataTypes.DECIMAL(14, 2), allowNull: false }
}, {
  tableName: 'transaksi',
  timestamps: false
});

Transaction.belongsTo(User, { foreignKey: 'user_id', as: 'kasir' });
User.hasMany(Transaction, { foreignKey: 'user_id' });

Transaction.belongsTo(Product, { foreignKey: 'produk_id', as: 'produk' });
Product.hasMany(Transaction, { foreignKey: 'produk_id' });

module.exports = Transaction;
