<template>
  <div class="flex min-h-screen bg-gray-50">
    <Sidebar />

    <main class="flex-1 transition-all duration-300 flex flex-col" :class="isCollapsed ? 'ml-16' : 'ml-60'">

      <!-- Topbar -->
      <div class="flex items-center gap-4 px-6 py-3 bg-white border-b border-gray-100 sticky top-0 z-10">
        <button
          @click="toggle"
          class="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors shrink-0"
        >
          <PanelLeftClose v-if="!isCollapsed" class="w-4 h-4" />
          <PanelLeftOpen v-else class="w-4 h-4" />
        </button>
        <div class="h-5 w-px bg-gray-200"></div>
        <span class="text-sm font-medium text-gray-600">Dashboard</span>
      </div>

      <!-- Content -->
      <div class="flex-1 p-8">

        <!-- Page title -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-800">Dashboard</h2>
          <p class="text-sm text-gray-400 mt-1">Ringkasan data penjualan</p>
        </div>

        <!-- Stat Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <!-- Total Produk -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm font-medium text-gray-500">Total Produk</span>
              <div class="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Package class="w-5 h-5 text-indigo-600" />
              </div>
            </div>
            <p class="text-3xl font-bold text-gray-800">{{ stats.totalProduk }}</p>
            <p class="text-xs text-gray-400 mt-1">produk tersedia</p>
          </div>

          <!-- Total Transaksi -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm font-medium text-gray-500">Total Transaksi</span>
              <div class="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <ShoppingCart class="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <p class="text-3xl font-bold text-gray-800">{{ stats.totalTransaksi }}</p>
            <p class="text-xs text-gray-400 mt-1">transaksi tercatat</p>
          </div>

          <!-- Total Pendapatan -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm font-medium text-gray-500">Total Pendapatan</span>
              <div class="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <DollarSign class="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p class="text-3xl font-bold text-gray-800">{{ formatRupiah(stats.totalPendapatan) }}</p>
            <p class="text-xs text-gray-400 mt-1">dari semua transaksi</p>
          </div>
        </div>

        <!-- Transaksi Terbaru -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div class="px-6 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 class="font-semibold text-gray-700">Transaksi Terbaru</h3>
            <RouterLink
              to="/transactions"
              class="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 transition-all duration-150"
            >
              Lihat Semua &rarr;
            </RouterLink>
          </div>

          <div v-if="loading" class="px-6 py-10 text-center text-gray-400 text-sm">Memuat data...</div>

          <div v-else-if="recentTransaksi.length === 0" class="px-6 py-10 text-center text-gray-400 text-sm">
            Belum ada transaksi
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                  <th class="px-6 py-3 text-left">Tanggal</th>
                  <th class="px-6 py-3 text-left">Produk</th>
                  <th class="px-6 py-3 text-left">Qty</th>
                  <th class="px-6 py-3 text-left">Total</th>
                  <th class="px-6 py-3 text-left">Kasir</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr v-for="t in recentTransaksi" :key="t.id" class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 text-gray-600">{{ formatDate(t.tanggal_transaksi) }}</td>
                  <td class="px-6 py-4 font-medium text-gray-800">{{ t.nama_produk }}</td>
                  <td class="px-6 py-4 text-gray-600">{{ t.qty }}</td>
                  <td class="px-6 py-4 font-semibold text-emerald-600">{{ formatRupiah(t.total_harga) }}</td>
                  <td class="px-6 py-4 text-gray-600">{{ t.username }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import Sidebar from '../components/Sidebar.vue'
import api from '../services/api'
import { useRoute } from 'vue-router'
import { useToast } from '../composables/useToast'
import { useSidebar } from '../composables/useSidebar'
import { Package, ShoppingCart, DollarSign, ChevronLeft, ChevronRight, PanelLeftOpen, PanelLeftClose } from '@lucide/vue'

const { isCollapsed, toggle } = useSidebar()

const loading = ref(true)
const stats = ref({ totalProduk: 0, totalTransaksi: 0, totalPendapatan: 0 })
const recentTransaksi = ref([])
const route = useRoute()
const { showToast } = useToast()

async function fetchData() {
  loading.value = true
  try {
    const [produkRes, transaksiRes] = await Promise.all([
      api.get('/products'),
      api.get('/transactions'),
    ])

    const produk    = produkRes.data.data
    const transaksi = transaksiRes.data.data

    stats.value.totalProduk     = produk.length
    stats.value.totalTransaksi  = transaksi.length
    stats.value.totalPendapatan = transaksi.reduce((sum, t) => sum + Number(t.total_harga), 0)
    recentTransaksi.value       = transaksi.slice(0, 6)
  } catch (err) {
    console.error('Dashboard fetch error:', err)
  } finally {
    loading.value = false
  }
}

function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value)
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

onMounted(() => {
  if (route.query.login === 'true') {
    const user = JSON.parse(localStorage.getItem('user') ?? '{}')
    showToast(`Selamat datang, ${user.username}! 👋`, 'success')
  }
  fetchData()
})
</script>
