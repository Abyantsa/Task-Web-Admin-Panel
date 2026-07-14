const app  = require('./app');
require('./config/db'); // trigger koneksi & log saat startup

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
