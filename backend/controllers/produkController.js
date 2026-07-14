const pool = require('../config/db');

/**
 * GET /api/products
 * Semua user terautentikasi bisa akses.
 */
async function getAll(req, res) {
  try {
    const result = await pool.query(
      'SELECT * FROM produk ORDER BY id ASC'
    );
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('getAll produk error:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
}

/**
 * POST /api/products
 * Body: { nama_produk, harga, stok }
 * Hanya admin.
 */
async function create(req, res) {
  const { nama_produk, harga, stok = 0 } = req.body;

  if (!nama_produk || harga === undefined) {
    return res.status(400).json({ success: false, message: 'nama_produk dan harga wajib diisi' });
  }

  if (Number(harga) < 0) {
    return res.status(400).json({ success: false, message: 'Harga tidak boleh negatif' });
  }

  if (Number(stok) < 0) {
    return res.status(400).json({ success: false, message: 'Stok tidak boleh negatif' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO produk (nama_produk, harga, stok) VALUES ($1, $2, $3) RETURNING *',
      [nama_produk, harga, stok]
    );
    return res.status(201).json({ success: true, message: 'Produk berhasil ditambahkan', data: result.rows[0] });
  } catch (err) {
    console.error('create produk error:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
}

/**
 * PUT /api/products/:id
 * Body: { nama_produk?, harga?, stok? }
 * Hanya admin.
 */
async function update(req, res) {
  const { id } = req.params;
  const { nama_produk, harga, stok } = req.body;

  if (!nama_produk && harga === undefined && stok === undefined) {
    return res.status(400).json({ success: false, message: 'Tidak ada field yang diupdate' });
  }

  try {
    // Ambil data lama dulu
    const existing = await pool.query('SELECT * FROM produk WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }

    const old = existing.rows[0];
    const newNama  = nama_produk ?? old.nama_produk;
    const newHarga = harga       !== undefined ? harga : old.harga;
    const newStok  = stok        !== undefined ? stok  : old.stok;

    if (Number(newHarga) < 0) {
      return res.status(400).json({ success: false, message: 'Harga tidak boleh negatif' });
    }
    if (Number(newStok) < 0) {
      return res.status(400).json({ success: false, message: 'Stok tidak boleh negatif' });
    }

    const result = await pool.query(
      'UPDATE produk SET nama_produk = $1, harga = $2, stok = $3 WHERE id = $4 RETURNING *',
      [newNama, newHarga, newStok, id]
    );
    return res.json({ success: true, message: 'Produk berhasil diupdate', data: result.rows[0] });
  } catch (err) {
    console.error('update produk error:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
}

/**
 * DELETE /api/products/:id
 * Hanya admin.
 */
async function remove(req, res) {
  const { id } = req.params;

  try {
    const existing = await pool.query('SELECT * FROM produk WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }

    await pool.query('DELETE FROM produk WHERE id = $1', [id]);
    return res.json({ success: true, message: 'Produk berhasil dihapus' });
  } catch (err) {
    // Pelanggaran RESTRICT (produk masih direferensikan transaksi)
    if (err.code === '23503') {
      return res.status(409).json({
        success: false,
        message: 'Produk tidak bisa dihapus karena masih ada transaksi terkait',
      });
    }
    console.error('delete produk error:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
}

module.exports = { getAll, create, update, remove };
