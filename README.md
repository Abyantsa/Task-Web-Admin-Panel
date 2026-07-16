# Task Web Admin Panel

Admin panel sederhana untuk manajemen penjualan — mengelola produk, mencatat transaksi, dan melihat ringkasan data secara real-time.

---

## Tech Stack

### Backend
| Teknologi | Versi | Keterangan |
|-----------|-------|------------|
| Node.js | >= 18 | Runtime JavaScript |
| Express.js | ^5.2.1 | Web framework |
| PostgreSQL | >= 13 | Database relasional |
| `pg` | ^8.22.0 | PostgreSQL client untuk Node.js |
| `bcryptjs` | ^3.0.3 | Hashing password |
| `jsonwebtoken` | ^9.0.3 | JWT authentication |
| `dotenv` | ^17.4.2 | Manajemen environment variable |
| `cors` | ^2.8.6 | Cross-Origin Resource Sharing |
| `nodemon` | ^3.1.14 | Auto-restart server saat development |

### Frontend
| Teknologi | Versi | Keterangan |
|-----------|-------|------------|
| Vue 3 | ^3.5.39 | Frontend framework (Composition API) |
| Vite | ^8.1.4 | Build tool & dev server |
| Vue Router | ^5.1.0 | Client-side routing |
| Tailwind CSS | ^4.3.2 | Utility-first CSS framework |
| Axios | ^1.18.1 | HTTP client untuk komunikasi ke API |
| Lucide Vue | ^1.24.0 | Icon library |

---

## Project Structure

```
Task-Web-Admin-Panel/
├── backend/
│   ├── config/
│   │   └── db.js                  # Koneksi pool PostgreSQL
│   ├── controllers/
│   │   ├── authController.js      # Login handler
│   │   ├── produkController.js    # CRUD produk
│   │   └── transaksiController.js # Buat & lihat transaksi
│   ├── middlewares/
│   │   └── auth.js                # JWT verify (authenticate) + role guard (adminOnly)
│   ├── models/                    # (reserved)
│   ├── routes/
│   │   ├── authRoutes.js          # POST /api/auth/login
│   │   ├── produkRoutes.js        # CRUD /api/products
│   │   └── transaksiRoutes.js     # GET & POST /api/transactions
│   ├── app.js                     # Express setup & mount routes
│   ├── server.js                  # Entry point, listen port
│   ├── seed.js                    # Script insert data awal
│   ├── .env                       # Environment variable (tidak di-commit)
│   ├── .env.example               # Template .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── assets/
    │   │   └── main.css           # Tailwind CSS import
    │   ├── components/
    │   │   ├── Sidebar.vue        # Navigasi + user info + logout + collapse
    │   │   └── Toast.vue          # Komponen notifikasi toast
    │   ├── composables/
    │   │   ├── usePagination.js   # Pagination logic (reactive perPage)
    │   │   ├── useSidebar.js      # Sidebar collapse state (singleton)
    │   │   └── useToast.js        # Toast state singleton
    │   ├── router/
    │   │   └── index.js           # Route definitions + auth guard (beforeEach)
    │   ├── services/
    │   │   └── api.js             # Axios instance + interceptor JWT
    │   ├── views/
    │   │   ├── LoginView.vue      # Halaman login
    │   │   ├── DashboardView.vue  # Statistik & transaksi terbaru
    │   │   ├── ProdukView.vue     # Tabel produk + CRUD modal
    │   │   └── TransaksiView.vue  # Form transaksi + riwayat
    │   ├── App.vue
    │   └── main.js
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

---

## API Mapping

Peta lengkap setiap endpoint — dari route, middleware yang dijalankan, hingga fungsi controller yang menanganinya.

### Auth

| Method | Endpoint | Middleware | Controller | Aksi |
|--------|----------|------------|------------|------|
| `POST` | `/api/auth/login` | — | `authController.login` | Validasi username & password, kembalikan JWT token |

**Request body:**
```json
{ "username": "admin", "password": "admin123" }
```

**Response sukses (`200`):**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "<jwt>",
    "user": { "id": 1, "username": "admin", "role": "admin" }
  }
}
```

---

### Produk

| Method | Endpoint | Middleware | Controller | Aksi |
|--------|----------|------------|------------|------|
| `GET` | `/api/products` | `authenticate` | `produkController.getAll` | Ambil semua produk (urut by id ASC) |
| `POST` | `/api/products` | `authenticate` → `adminOnly` | `produkController.create` | Tambah produk baru |
| `PUT` | `/api/products/:id` | `authenticate` → `adminOnly` | `produkController.update` | Edit produk (partial update, field opsional) |
| `DELETE` | `/api/products/:id` | `authenticate` → `adminOnly` | `produkController.remove` | Hapus produk (gagal jika masih ada transaksi terkait) |

**POST/PUT request body:**
```json
{ "nama_produk": "Kopi Susu", "harga": 15000, "stok": 50 }
```

**Catatan validasi:**
- `nama_produk` dan `harga` wajib saat `POST`
- `harga` dan `stok` tidak boleh negatif
- `DELETE` akan mengembalikan `409 Conflict` jika produk masih direferensikan oleh transaksi

---

### Transaksi

| Method | Endpoint | Middleware | Controller | Aksi |
|--------|----------|------------|------------|------|
| `GET` | `/api/transactions` | `authenticate` | `transaksiController.getAll` | Ambil semua transaksi dengan detail produk & user (urut by id DESC) |
| `POST` | `/api/transactions` | `authenticate` | `transaksiController.create` | Buat transaksi baru, otomatis kurangi stok produk |

**POST request body:**
```json
{ "produk_id": 1, "qty": 3 }
```

**Catatan:**
- `total_harga` dihitung otomatis: `harga_satuan × qty`
- Menggunakan **database transaction** (BEGIN/COMMIT/ROLLBACK) dengan row-level lock (`FOR UPDATE`) untuk mencegah race condition stok
- Gagal dengan `400` jika stok tidak mencukupi

---

### Middleware Detail

| Middleware | Lokasi | Fungsi |
|------------|--------|--------|
| `authenticate` | `middlewares/auth.js` | Verifikasi JWT dari `Authorization: Bearer <token>`. Inject `req.user = { id, username, role }` |
| `adminOnly` | `middlewares/auth.js` | Cek `req.user.role === 'admin'`. Harus dipakai **setelah** `authenticate` |

---

## Frontend Route Mapping

Peta route Vue Router dan komponen view yang ditampilkan.

| Path | Name | Component | Guard |
|------|------|-----------|-------|
| `/login` | `Login` | `LoginView.vue` | Redirect ke `/` jika sudah login |
| `/` | `Dashboard` | `DashboardView.vue` | Redirect ke `/login` jika belum login |
| `/products` | `Produk` | `ProdukView.vue` | Redirect ke `/login` jika belum login |
| `/transactions` | `Transaksi` | `TransaksiView.vue` | Redirect ke `/login` jika belum login |

**Navigation guard (`router.beforeEach`):**
- Route tanpa `meta.public` → wajib ada token di localStorage
- Jika sudah login dan mengakses `/login` → otomatis redirect ke Dashboard

---

## Alur Request (Flow Diagram)

```
Client (Vue)
    │
    ├─ POST /api/auth/login
    │       └─ authController.login
    │               └─ bcrypt.compare → jwt.sign → return token
    │
    ├─ GET  /api/products
    │       └─ authenticate → produkController.getAll
    │
    ├─ POST /api/products         (admin only)
    │       └─ authenticate → adminOnly → produkController.create
    │
    ├─ PUT  /api/products/:id     (admin only)
    │       └─ authenticate → adminOnly → produkController.update
    │
    ├─ DELETE /api/products/:id   (admin only)
    │       └─ authenticate → adminOnly → produkController.remove
    │
    ├─ GET  /api/transactions
    │       └─ authenticate → transaksiController.getAll
    │
    └─ POST /api/transactions
            └─ authenticate → transaksiController.create
                    └─ BEGIN → lock produk → kurangi stok → insert transaksi → COMMIT
```

---

## Database Schema

```sql
-- Users
CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  username   VARCHAR(50) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,        -- bcrypt hash
  role       VARCHAR(20) NOT NULL DEFAULT 'kasir',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Produk
CREATE TABLE produk (
  id          SERIAL PRIMARY KEY,
  nama_produk VARCHAR(100) NOT NULL,
  harga       NUMERIC(12, 2) NOT NULL CHECK (harga >= 0),
  stok        INTEGER NOT NULL DEFAULT 0 CHECK (stok >= 0),
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Transaksi
CREATE TABLE transaksi (
  id                SERIAL PRIMARY KEY,
  tanggal_transaksi DATE NOT NULL DEFAULT CURRENT_DATE,
  produk_id         INTEGER NOT NULL REFERENCES produk(id) ON DELETE RESTRICT,
  user_id           INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  qty               INTEGER NOT NULL CHECK (qty > 0),
  total_harga       NUMERIC(14, 2) NOT NULL CHECK (total_harga >= 0)
);
```

---

## Setup Backend

### 1. Prasyarat
- Node.js >= 18
- PostgreSQL >= 13

### 2. Install dependencies
```bash
cd backend
npm install
```

### 3. Konfigurasi environment
```bash
cp .env.example .env
```

Edit file `.env` sesuai konfigurasi lokal:
```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=admin_panel
DB_USER=postgres
DB_PASSWORD=yourpassword

JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=8h
```

### 4. Buat database & jalankan schema
Buat database di PostgreSQL, lalu jalankan file SQL schema:
```bash
psql -U postgres -d admin_panel -f schema.sql
```

### 5. Seed data awal
```bash
node seed.js
```

Akan membuat:
- User **admin** → password: `admin123`
- User **kasir1** → password: `kasir123`
- 3 produk contoh

### 6. Jalankan server
```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

Server berjalan di `http://localhost:3000`

---

## Setup Frontend

### 1. Install dependencies
```bash
cd frontend
npm install
```

### 2. Jalankan dev server
```bash
npm run dev
```

Aplikasi berjalan di `http://localhost:5173`

### 3. Build untuk production
```bash
npm run build
```

---

## Fitur

- **Autentikasi** — Login dengan JWT, token disimpan di localStorage, auto-redirect jika belum login
- **Role-based access** — Admin bisa CRUD produk, kasir hanya bisa lihat & buat transaksi
- **Dashboard** — Statistik total produk, transaksi, dan pendapatan + transaksi terbaru
- **Manajemen Produk** — Tabel dengan search realtime, pagination dinamis, badge stok warna-warni
- **Transaksi** — Form buat transaksi dengan preview total, validasi stok, riwayat dengan pagination
- **Toast Notification** — Notifikasi pojok kanan atas untuk setiap aksi (success, error, warning, info)
- **Confirm Dialog** — Konfirmasi sebelum menghapus produk
- **Sidebar Collapsible** — State collapse disimpan di localStorage

---

## Default Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Kasir | `kasir1` | `kasir123` |

> Ganti password setelah pertama kali login di production.

---

## Screenshots

<table>
  <tr>
    <td align="center" colspan="2"><b>🔐 Login Page</b></td>
  </tr>
  <tr>
    <td colspan="2">
      <img src="https://github.com/user-attachments/assets/f064fa1f-b09c-428e-a346-1e6cadd72caa" alt="Login Page" width="100%"/>
    </td>
  </tr>

  <tr><td colspan="2"><br/></td></tr>

  <tr>
    <td align="center" colspan="2"><b>📊 Dashboard</b></td>
  </tr>
  <tr>
    <td colspan="2">
      <img src="https://github.com/user-attachments/assets/b69fd389-e095-4a33-8192-b9533b628004" alt="Dashboard" width="100%"/>
    </td>
  </tr>

  <tr><td colspan="2"><br/></td></tr>

  <tr>
    <td align="center" colspan="2"><b>📦 Halaman Produk</b></td>
  </tr>
  <tr>
    <td colspan="2">
      <img src="https://github.com/user-attachments/assets/b2c600db-662e-41bc-83d9-9f09971631af" alt="Halaman Produk" width="100%"/>
    </td>
  </tr>

  <tr><td colspan="2"><br/></td></tr>

  <tr>
    <td align="center" colspan="2"><b>✏️ Modal Produk — Tambah / Edit / Hapus</b></td>
  </tr>
  <tr>
    <td align="center" width="33%">
      <img src="https://github.com/user-attachments/assets/b6ce31c2-8fa4-45f8-ad10-3bf543116166" alt="Modal Tambah Produk" width="100%"/>
      <sub>Tambah</sub>
    </td>
    <td align="center" width="33%">
      <img src="https://github.com/user-attachments/assets/200f0648-41f6-4ddf-be39-58745f339bb8" alt="Modal Edit Produk" width="100%"/>
      <sub>Edit</sub>
    </td>
  </tr>
  <tr>
    <td colspan="2" align="center">
      <img src="https://github.com/user-attachments/assets/20edd987-02a8-4ff5-b8e2-8058cd3353ba" alt="Konfirmasi Hapus Produk" width="50%"/>
      <br/><sub>Konfirmasi Hapus</sub>
    </td>
  </tr>

  <tr><td colspan="2"><br/></td></tr>

  <tr>
    <td align="center" colspan="2"><b>🧾 Halaman Transaksi</b></td>
  </tr>
  <tr>
    <td colspan="2">
      <img src="https://github.com/user-attachments/assets/12a259c5-2a4e-4dc4-b19d-e6b0510b4740" alt="Halaman Transaksi" width="100%"/>
    </td>
  </tr>

  <tr><td colspan="2"><br/></td></tr>

  <tr>
    <td align="center" colspan="2"><b>🔔 Toast Notification</b></td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/62e73a90-83d2-47b9-83ce-67e6086aff6d" alt="Toast Success" width="100%"/>
      <sub>Success</sub>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/29f50cea-fb49-4773-bc7b-969fc89117a3" alt="Toast Error" width="100%"/>
      <sub>Error</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/ea64168c-f30e-4e03-a500-b3140e940907" alt="Toast Warning" width="100%"/>
      <sub>Warning</sub>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/034d9831-a171-4715-9e48-a498199ee0f8" alt="Toast Info" width="100%"/>
      <sub>Info</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/fad7fc84-a283-466a-90c2-827e055dc055" alt="Toast Delete" width="100%"/>
      <sub>Delete</sub>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/1df6e300-5e32-4baf-8c67-338dcb6f04c6" alt="Toast Warning Stok" width="100%"/>
      <sub>Warning Stok</sub>
    </td>
  </tr>
</table>





