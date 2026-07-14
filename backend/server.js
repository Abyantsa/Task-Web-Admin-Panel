const app = require('./app');
const { connectDB, sequelize } = require('./config/database');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();

  // Sync semua model ke database (alter: true agar tidak drop table)
  await sequelize.sync({ alter: true });
  console.log('Database synced.');

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
