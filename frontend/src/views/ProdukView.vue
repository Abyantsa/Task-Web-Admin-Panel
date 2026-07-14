<template>
  <div class="flex min-h-screen bg-gray-50">
    <Sidebar />

    <main class="ml-60 flex-1 p-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Produk</h2>
          <p class="text-sm text-gray-500 mt-1">Kelola master data produk</p>
        </div>
        <button
          v-if="isAdmin"
          @click="openModal()"
          class="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          <span class="text-base">+</span> Tambah Produk
        </button>
      </div>

      <!-- Search -->
      <div class="mb-4">
        <div class="relative max-w-sm">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari nama produk..."
            class="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            &times;
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div v-if="loading" class="px-6 py-10 text-center text-gray-400 text-sm">Memuat data...</div>

        <div v-else-if="produkList.length === 0" class="px-6 py-10 text-center text-gray-400 text-sm">
          Belum ada produk
        </div>

        <div v-else-if="filteredProduk.length === 0" class="px-6 py-10 text-center text-gray-400 text-sm">
          Tidak ada produk yang cocok dengan "<span class="font-medium text-gray-600">{{ searchQuery }}</span>"
        </div>

        <div v-else class="overflow-x-auto">
          <!-- info hasil search -->
          <div v-if="searchQuery" class="px-6 pt-4 pb-2 text-xs text-gray-400">
            Menampilkan {{ filteredProduk.length }} dari {{ produkList.length }} produk
          </div>
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <th class="px-6 py-3 text-left">No</th>
                <th class="px-6 py-3 text-left">Nama Produk</th>
                <th class="px-6 py-3 text-left">Harga</th>
                <th class="px-6 py-3 text-left">Stok</th>
                <th v-if="isAdmin" class="px-6 py-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="(p, i) in filteredProduk" :key="p.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 text-gray-400">{{ i + 1 }}</td>
                <td class="px-6 py-4 font-medium text-gray-800">{{ p.nama_produk }}</td>
                <td class="px-6 py-4 text-gray-600">{{ formatRupiah(p.harga) }}</td>
                <td class="px-6 py-4">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                    :class="stokBadge(p.stok)"
                  >
                    {{ p.stok }}
                  </span>
                </td>
                <td v-if="isAdmin" class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <button
                      @click="openModal(p)"
                      class="text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      @click="confirmDelete(p)"
                      class="text-xs font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Modal Tambah/Edit -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center px-4">
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/40" @click="closeModal"></div>

        <!-- Card -->
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-gray-800">
              {{ editMode ? 'Edit Produk' : 'Tambah Produk' }}
            </h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
          </div>

          <form @submit.prevent="submitForm" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Nama Produk</label>
              <input
                v-model="form.nama_produk"
                type="text"
                placeholder="Nama produk"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Harga (Rp)</label>
              <input
                v-model.number="form.harga"
                type="number"
                min="0"
                placeholder="0"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Stok</label>
              <input
                v-model.number="form.stok"
                type="number"
                min="0"
                placeholder="0"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <!-- Error -->
            <div v-if="formError" class="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
              {{ formError }}
            </div>

            <div class="flex gap-3 pt-2">
              <button
                type="button"
                @click="closeModal"
                class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg text-sm transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-60"
                :disabled="submitting"
              >
                {{ submitting ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Modal Konfirmasi Hapus -->
    <Teleport to="body">
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div class="absolute inset-0 bg-black/40" @click="showDeleteModal = false"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10 text-center">
          <div class="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">🗑️</span>
          </div>
          <h3 class="text-lg font-bold text-gray-800 mb-2">Hapus Produk?</h3>
          <p class="text-sm text-gray-500 mb-6">
            Produk <span class="font-semibold text-gray-700">{{ deleteTarget?.nama_produk }}</span> akan dihapus permanen.
          </p>
          <div class="flex gap-3">
            <button
              @click="showDeleteModal = false"
              class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg text-sm transition-colors"
            >
              Batal
            </button>
            <button
              @click="deleteProduk"
              class="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-60"
              :disabled="submitting"
            >
              {{ submitting ? 'Menghapus...' : 'Hapus' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import api from '../services/api'
import { useToast } from '../composables/useToast'

const { showToast } = useToast()

const loading   = ref(true)
const produkList = ref([])
const searchQuery = ref('')
const showModal       = ref(false)
const showDeleteModal = ref(false)
const editMode   = ref(false)
const submitting = ref(false)
const formError  = ref('')
const deleteTarget = ref(null)

const form = ref({ id: null, nama_produk: '', harga: 0, stok: 0 })

const isAdmin = computed(() => {
  const user = JSON.parse(localStorage.getItem('user') ?? '{}')
  return user?.role === 'admin'
})

const filteredProduk = computed(() => {
  if (!searchQuery.value.trim()) return produkList.value
  const q = searchQuery.value.toLowerCase().trim()
  return produkList.value.filter(p =>
    p.nama_produk.toLowerCase().includes(q)
  )
})

async function fetchProduk() {
  loading.value = true
  try {
    const res = await api.get('/products')
    produkList.value = res.data.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

function openModal(produk = null) {
  formError.value = ''
  if (produk) {
    editMode.value = true
    form.value = { id: produk.id, nama_produk: produk.nama_produk, harga: Number(produk.harga), stok: produk.stok }
  } else {
    editMode.value = false
    form.value = { id: null, nama_produk: '', harga: 0, stok: 0 }
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function submitForm() {
  formError.value = ''
  submitting.value = true
  try {
    if (editMode.value) {
      await api.put(`/products/${form.value.id}`, {
        nama_produk: form.value.nama_produk,
        harga: form.value.harga,
        stok: form.value.stok,
      })
      showToast('Produk berhasil diupdate', 'success')
    } else {
      await api.post('/products', {
        nama_produk: form.value.nama_produk,
        harga: form.value.harga,
        stok: form.value.stok,
      })
      showToast('Produk berhasil ditambahkan', 'success')
    }
    closeModal()
    await fetchProduk()
  } catch (err) {
    formError.value = err.response?.data?.message ?? 'Terjadi kesalahan'
  } finally {
    submitting.value = false
  }
}

function confirmDelete(produk) {
  deleteTarget.value = produk
  showDeleteModal.value = true
}

async function deleteProduk() {
  submitting.value = true
  try {
    await api.delete(`/products/${deleteTarget.value.id}`)
    showDeleteModal.value = false
    showToast(`Produk "${deleteTarget.value.nama_produk}" berhasil dihapus`, 'success')
    await fetchProduk()
  } catch (err) {
    showDeleteModal.value = false
    showToast(err.response?.data?.message ?? 'Gagal menghapus produk', 'error')
  } finally {
    submitting.value = false
  }
}

function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value)
}

function stokBadge(stok) {
  if (stok === 0)  return 'bg-red-100 text-red-700'
  if (stok <= 10)  return 'bg-yellow-100 text-yellow-700'
  return 'bg-green-100 text-green-700'
}

onMounted(fetchProduk)
</script>
