const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING(50), unique: true, allowNull: false },
  password_hash: { type: DataTypes.STRING(255), allowNull: false },
  role: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'kasir' },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'users',
  timestamps: false
});

User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password_hash);
};

module.exports = User;
