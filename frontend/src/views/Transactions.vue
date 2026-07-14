<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Riwayat Transaksi</h1>
      <router-link to="/transactions/new" class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center">
        <span class="mr-2 text-lg leading-none">+</span> Kasir Baru
      </router-link>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm uppercase tracking-wider">
            <th class="p-4 font-semibold">ID Transaksi / Tanggal</th>
            <th class="p-4 font-semibold">Item & Qty</th>
            <th class="p-4 font-semibold">Total Harga</th>
            <th class="p-4 font-semibold">Kasir</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="t in transactions" :key="t.id" class="hover:bg-gray-50 transition-colors">
            <td class="p-4">
              <div class="font-medium text-gray-800 text-sm">#TRX-{{ t.id }}</div>
              <div class="text-xs text-gray-500 mt-1">{{ formatDate(t.tanggal_transaksi) }}</div>
            </td>
            <td class="p-4 text-gray-600">
              <div class="font-medium text-gray-800 text-sm">{{ t.produk?.nama_produk || 'Produk Dihapus' }}</div>
              <span class="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-semibold mt-1 inline-block">
                {{ t.qty }} pcs
              </span>
            </td>
            <td class="p-4 font-bold text-emerald-600">Rp {{ formatPrice(t.total_harga) }}</td>
            <td class="p-4 text-gray-600 text-sm">
              <div class="flex items-center">
                <div class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs mr-2">👤</div>
                {{ t.kasir?.username || 'Unknown' }}
              </div>
            </td>
          </tr>
          <tr v-if="transactions.length === 0">
            <td colspan="4" class="p-8 text-center text-gray-500">Belum ada riwayat transaksi.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const transactions = ref([]);

const formatPrice = (price) => Number(price).toLocaleString('id-ID');
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
};

onMounted(async () => {
  try {
    const res = await api.get('/transactions');
    transactions.value = res.data;
  } catch (error) {
    console.error('Failed to fetch transactions', error);
  }
});
</script>
