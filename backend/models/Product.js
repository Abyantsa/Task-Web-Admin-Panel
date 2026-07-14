const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nama_produk: { type: DataTypes.STRING(100), allowNull: false },
  harga: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  stok: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'produk',
  timestamps: false
});

module.exports = Product;
