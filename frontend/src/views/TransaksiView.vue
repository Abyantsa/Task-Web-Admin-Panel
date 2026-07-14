<template>
  <div class="flex min-h-screen bg-gray-50">
    <Sidebar />

    <main class="ml-60 flex-1 p-8">
      <!-- Header -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800">Transaksi</h2>
        <p class="text-sm text-gray-500 mt-1">Buat transaksi baru dan lihat riwayat</p>
      </div>

      <!-- Form Buat Transaksi -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h3 class="font-semibold text-gray-700 mb-4">Buat Transaksi Baru</h3>

        <form @submit.prevent="submitTransaksi" class="flex flex-col sm:flex-row gap-4 items-end">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Pilih Produk</label>
            <select
              v-model="form.produk_id"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            >
              <option value="" disabled>-- Pilih produk --</option>
              <option
                v-for="p in produkList"
                :key="p.id"
                :value="p.id"
                :disabled="p.stok === 0"
              >
                {{ p.nama_produk }} — {{ formatRupiah(p.harga) }} (stok: {{ p.stok }})
              </option>
            </select>
          </div>

          <div class="w-32">
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Qty</label>
            <input
              v-model.number="form.qty"
              type="number"
              min="1"
              placeholder="1"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <!-- Preview total -->
          <div v-if="previewTotal" class="hidden sm:block text-sm text-gray-600">
            <p class="text-xs text-gray-400 mb-1">Total</p>
            <p class="font-bold text-emerald-600 text-base">{{ formatRupiah(previewTotal) }}</p>
          </div>

          <button
            type="submit"
            class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-60 whitespace-nowrap"
            :disabled="submitting"
          >
            {{ submitting ? 'Memproses...' : 'Buat Transaksi' }}
          </button>
        </form>
      </div>

      <!-- Tabel Riwayat -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="font-semibold text-gray-700">Riwayat Transaksi</h3>
          <span class="text-xs text-gray-400">{{ transaksiList.length }} transaksi</span>
        </div>

        <div v-if="loading" class="px-6 py-10 text-center text-gray-400 text-sm">Memuat data...</div>

        <div v-else-if="transaksiList.length === 0" class="px-6 py-10 text-center text-gray-400 text-sm">
          Belum ada transaksi
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <th class="px-6 py-3 text-left">No</th>
                <th class="px-6 py-3 text-left">Tanggal</th>
                <th class="px-6 py-3 text-left">Produk</th>
                <th class="px-6 py-3 text-left">Harga Satuan</th>
                <th class="px-6 py-3 text-left">Qty</th>
                <th class="px-6 py-3 text-left">Total</th>
                <th class="px-6 py-3 text-left">Kasir</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="(t, i) in paginatedList" :key="t.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 text-gray-400">{{ startIndex + i }}</td>
                <td class="px-6 py-4 text-gray-600">{{ formatDate(t.tanggal_transaksi) }}</td>
                <td class="px-6 py-4 font-medium text-gray-800">{{ t.nama_produk }}</td>
                <td class="px-6 py-4 text-gray-600">{{ formatRupiah(t.harga_satuan) }}</td>
                <td class="px-6 py-4 text-gray-600">{{ t.qty }}</td>
                <td class="px-6 py-4 font-semibold text-emerald-600">{{ formatRupiah(t.total_harga) }}</td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center gap-1 text-xs text-gray-600">
                    <span class="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center uppercase text-xs">
                      {{ t.username?.charAt(0) }}
                    </span>
                    {{ t.username }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination -->
          <div v-if="totalPages > 1 || transaksiList.length > 0" class="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <p class="text-xs text-gray-400">
                Menampilkan {{ startIndex }}–{{ endIndex }} dari {{ transaksiList.length }} transaksi
              </p>
              <!-- Per page selector -->
              <select
                v-model.number="perPage"
                class="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option :value="5">5 / halaman</option>
                <option :value="10">10 / halaman</option>
                <option :value="15">15 / halaman</option>
                <option :value="20">20 / halaman</option>
              </select>
            </div>
            <div class="flex items-center gap-1">
              <button
                @click="prev"
                :disabled="currentPage === 1"
                class="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Prev
              </button>
              <template v-for="page in pageNumbers" :key="page">
                <span v-if="page === '...'" class="px-2 text-gray-400 text-xs">…</span>
                <button
                  v-else
                  @click="goTo(page)"
                  class="w-8 h-8 text-xs rounded-lg border transition-colors"
                  :class="currentPage === page
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'"
                >
                  {{ page }}
                </button>
              </template>
              <button
                @click="next"
                :disabled="currentPage === totalPages"
                class="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import api from '../services/api'
import { useToast } from '../composables/useToast'
import { usePagination } from '../composables/usePagination'

const { showToast } = useToast()

const loading    = ref(true)
const submitting = ref(false)
const produkList    = ref([])
const transaksiList = ref([])

const form = ref({ produk_id: '', qty: 1 })

const previewTotal = computed(() => {
  const produk = produkList.value.find(p => p.id === form.value.produk_id)
  if (!produk || !form.value.qty) return null
  return Number(produk.harga) * Number(form.value.qty)
})

const {
  currentPage, perPage, totalPages, paginatedList,
  startIndex, endIndex, pageNumbers, goTo, prev, next,
} = usePagination(transaksiList, 10)

async function fetchAll() {
  loading.value = true
  try {
    const [produkRes, transaksiRes] = await Promise.all([
      api.get('/products'),
      api.get('/transactions'),
    ])
    produkList.value    = produkRes.data.data
    transaksiList.value = transaksiRes.data.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

async function submitTransaksi() {
  submitting.value = true
  try {
    await api.post('/transactions', {
      produk_id: form.value.produk_id,
      qty: form.value.qty,
    })
    showToast('Transaksi berhasil dibuat!', 'success')
    form.value = { produk_id: '', qty: 1 }
    await fetchAll()
  } catch (err) {
    showToast(err.response?.data?.message ?? 'Terjadi kesalahan', 'error')
  } finally {
    submitting.value = false
  }
}

function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value)
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

onMounted(fetchAll)
</script>
