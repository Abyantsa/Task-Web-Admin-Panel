<template>
  <div class="flex min-h-screen bg-gray-50">
    <Sidebar />

    <main
      class="flex-1 flex flex-col min-w-0 transition-all duration-300"
      :class="isCollapsed ? 'lg:ml-16' : 'lg:ml-60'"
    >
      <!-- Topbar -->
      <div class="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-10">
        <!-- Mobile: hamburger -->
        <button
          @click="openMobile"
          class="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors shrink-0"
        >
          <Menu class="w-4 h-4" />
        </button>

        <!-- Desktop: collapse toggle -->
        <button
          @click="toggle"
          class="hidden lg:flex w-8 h-8 rounded-lg items-center justify-center bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors shrink-0"
        >
          <PanelLeftClose v-if="!isCollapsed" class="w-4 h-4" />
          <PanelLeftOpen  v-else              class="w-4 h-4" />
        </button>

        <div class="h-5 w-px bg-gray-200"></div>
        <span class="text-sm font-medium text-gray-600">Dashboard</span>
      </div>

      <!-- Content -->
      <div class="flex-1 p-4 sm:p-6 lg:p-8">

        <!-- Page title -->
        <div class="mb-6 lg:mb-8">
          <h2 class="text-xl sm:text-2xl font-bold text-gray-800">Dashboard</h2>
          <p class="text-sm text-gray-400 mt-1">Ringkasan data penjualan</p>
        </div>

        <!-- Stat Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 lg:p-6">
            <div class="flex items-center justify-between mb-3 lg:mb-4">
              <span class="text-sm font-medium text-gray-500">Total Produk</span>
              <div class="w-9 h-9 lg:w-10 lg:h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Package class="w-4 h-4 lg:w-5 lg:h-5 text-indigo-600" />
              </div>
            </div>
            <p class="text-2xl lg:text-3xl font-bold text-gray-800">{{ stats.totalProduk }}</p>
            <p class="text-xs text-gray-400 mt-1">produk tersedia</p>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 lg:p-6">
            <div class="flex items-center justify-between mb-3 lg:mb-4">
              <span class="text-sm font-medium text-gray-500">Total Transaksi</span>
              <div class="w-9 h-9 lg:w-10 lg:h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <ShoppingCart class="w-4 h-4 lg:w-5 lg:h-5 text-emerald-600" />
              </div>
            </div>
            <p class="text-2xl lg:text-3xl font-bold text-gray-800">{{ stats.totalTransaksi }}</p>
            <p class="text-xs text-gray-400 mt-1">transaksi tercatat</p>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 lg:p-6">
            <div class="flex items-center justify-between mb-3 lg:mb-4">
              <span class="text-sm font-medium text-gray-500">Total Pendapatan</span>
              <div class="w-9 h-9 lg:w-10 lg:h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <DollarSign class="w-4 h-4 lg:w-5 lg:h-5 text-amber-600" />
              </div>
            </div>
            <p class="text-2xl lg:text-3xl font-bold text-gray-800">{{ formatRupiah(stats.totalPendapatan) }}</p>
            <p class="text-xs text-gray-400 mt-1">dari semua transaksi</p>
          </div>
        </div>

        <!-- Transaksi Terbaru -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div class="px-4 sm:px-6 py-3 border-b border-gray-100 flex items-center justify-between gap-3">
            <h3 class="font-semibold text-gray-700 text-sm sm:text-base">7 Transaksi Terbaru</h3>
            <RouterLink
              to="/transactions"
              class="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-md shadow-indigo-200 transition-all duration-150 whitespace-nowrap"
            >
              Lihat Semua →
            </RouterLink>
          </div>

          <div v-if="loading" class="px-6 py-10 text-center text-gray-400 text-sm">Memuat data...</div>

          <div v-else-if="recentTransaksi.length === 0" class="px-6 py-10 text-center text-gray-400 text-sm">
            Belum ada transaksi
          </div>

          <div v-else>
            <!-- Mobile: card list -->
            <div class="lg:hidden divide-y divide-gray-50">
              <div
                v-for="t in recentTransaksi"
                :key="t.id"
                class="px-4 py-3.5 hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-start justify-between gap-3 mb-1">
                  <p class="font-medium text-gray-800 text-sm">{{ t.nama_produk }}</p>
                  <p class="font-bold text-emerald-600 text-sm whitespace-nowrap">{{ formatRupiah(t.total_harga) }}</p>
                </div>
                <div class="flex items-center gap-2 text-xs text-gray-400">
                  <span>{{ formatDate(t.tanggal_transaksi) }}</span>
                  <span>·</span>
                  <span>Qty {{ t.qty }}</span>
                  <span>·</span>
                  <span>{{ t.username }}</span>
                </div>
              </div>
            </div>

            <!-- Desktop: tabel -->
            <div class="hidden lg:block overflow-x-auto">
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

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import Sidebar from '../components/Sidebar.vue'
import api from '../services/api'
import { useToast } from '../composables/useToast'
import { useSidebar } from '../composables/useSidebar'
import { Package, ShoppingCart, DollarSign, PanelLeftOpen, PanelLeftClose, Menu } from '@lucide/vue'

const { isCollapsed, toggle, openMobile } = useSidebar()
const { showToast } = useToast()
const route = useRoute()

const loading = ref(true)
const stats = ref({ totalProduk: 0, totalTransaksi: 0, totalPendapatan: 0 })
const recentTransaksi = ref([])

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
    recentTransaksi.value       = transaksi.slice(0, 7)
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
