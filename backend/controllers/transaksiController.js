const pool = require('../config/db');

/**
 * GET /api/transactions
 * Semua user terautentikasi bisa akses.
 * Sertakan detail nama produk & username.
 */
async function getAll(req, res) {
  try {
    const result = await pool.query(`
      SELECT
        t.id,
        t.tanggal_transaksi,
        t.qty,
        t.total_harga,
        p.id          AS produk_id,
        p.nama_produk,
        p.harga       AS harga_satuan,
        u.id          AS user_id,
        u.username,
        u.role
      FROM transaksi t
      JOIN produk p ON t.produk_id = p.id
      JOIN users  u ON t.user_id   = u.id
      ORDER BY t.id DESC
    `);
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('getAll transaksi error:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
}

/**
 * POST /api/transactions
 * Body: { produk_id, qty }
 * Semua user terautentikasi bisa buat transaksi.
 * Otomatis: hitung total_harga, kurangi stok.
 */
async function create(req, res) {
  const { produk_id, qty } = req.body;
  const user_id = req.user.id;

  if (!produk_id || !qty) {
    return res.status(400).json({ success: false, message: 'produk_id dan qty wajib diisi' });
  }

  if (Number(qty) <= 0 || !Number.isInteger(Number(qty))) {
    return res.status(400).json({ success: false, message: 'qty harus bilangan bulat lebih dari 0' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Lock baris produk agar tidak ada race condition stok
    const produkResult = await client.query(
      'SELECT * FROM produk WHERE id = $1 FOR UPDATE',
      [produk_id]
    );

    if (produkResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }

    const produk = produkResult.rows[0];

    if (produk.stok < qty) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: `Stok tidak cukup. Stok tersedia: ${produk.stok}`,
      });
    }

    const total_harga = Number(produk.harga) * Number(qty);

    // Kurangi stok
    await client.query(
      'UPDATE produk SET stok = stok - $1 WHERE id = $2',
      [qty, produk_id]
    );

    // Simpan transaksi
    const transaksiResult = await client.query(
      `INSERT INTO transaksi (produk_id, user_id, qty, total_harga)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [produk_id, user_id, qty, total_harga]
    );

    await client.query('COMMIT');

    return res.status(201).json({
      success: true,
      message: 'Transaksi berhasil dibuat',
      data: {
        ...transaksiResult.rows[0],
        nama_produk:   produk.nama_produk,
        harga_satuan:  produk.harga,
      },
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('create transaksi error:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  } finally {
    client.release();
  }
}

module.exports = { getAll, create };
