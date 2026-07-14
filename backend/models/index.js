const sequelize = require('../config/database');
const User = require('./User');
const Product = require('./Product');
const Transaction = require('./Transaction');

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    // We intentionally disable auto-sync so we don't overwrite the user's SQL schema
    console.log('Database connection verified (No auto-sync).');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};

module.exports = {
  sequelize,
  syncDatabase,
  User,
  Product,
  Transaction
};
