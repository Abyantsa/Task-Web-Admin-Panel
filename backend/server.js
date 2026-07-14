const app = require('./app');
const { syncDatabase } = require('./models');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await syncDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
