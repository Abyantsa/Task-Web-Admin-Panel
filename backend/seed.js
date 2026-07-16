/**
 * seed.js — Isi data awal ke database
 * Jalankan sekali: node seed.js
 */

require('dotenv').config();
const pool   = require('./config/db');
const bcrypt = require('bcryptjs');

async function seed() {
  const client = await pool.connect();

  try {
    console.log('🌱 Mulai seeding...\n');

    // USERS
    const adminHash = await bcrypt.hash('admin123', 10);
    const kasirHash = await bcrypt.hash('kasir123', 10);

    const usersResult = await client.query(`
      INSERT INTO users (username, password, role) VALUES
        ('admin',  $1, 'admin'),
        ('kasir1', $2, 'kasir')
      ON CONFLICT (username) DO NOTHING
      RETURNING id, username, role;
    `, [adminHash, kasirHash]);

    if (usersResult.rows.length > 0) {
      console.log('✅ Users berhasil diinsert:');
      usersResult.rows.forEach(u => console.log(`   - [${u.role}] ${u.username}`));
    } else {
      console.log('⚠️  Users sudah ada, di-skip');
    }

    // PRODUK
    const produkResult = await client.query(`
      INSERT INTO produk (nama_produk, harga, stok) VALUES
        ('Kopi Arabica 250g', 45000,  50),
        ('Teh Hijau Premium', 32000, 100),
        ('Gula Pasir 1kg',    14000,  75)
      RETURNING id, nama_produk, harga, stok;
    `);

    console.log('\n✅ Produk berhasil diinsert:');
    produkResult.rows.forEach(p =>
      console.log(`   - [id:${p.id}] ${p.nama_produk} | Rp ${p.harga} | stok: ${p.stok}`)
    );

    // Reset sequences agar tidak collision setelah insert manual apapun
    await client.query("SELECT setval('users_id_seq',  (SELECT MAX(id) FROM users),  true)");
    await client.query("SELECT setval('produk_id_seq', (SELECT MAX(id) FROM produk), true)");
    console.log('✅ Sequences di-reset');

    console.log('\n🎉 Seeding selesai!');
    console.log('─────────────────────────────────');
    console.log('Login credentials:');
    console.log('  admin  → password: admin123');
    console.log('  kasir1 → password: kasir123');
    console.log('─────────────────────────────────\n');

  } catch (err) {
    console.error('❌ Seeding gagal:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
