<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-800 mb-8 tracking-tight">Dashboard Overview</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center hover:shadow-md transition-shadow">
        <div class="p-4 rounded-xl bg-blue-50 text-blue-600 mr-5 text-3xl">📦</div>
        <div>
          <p class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Jenis Produk</p>
          <p class="text-3xl font-bold text-gray-800">{{ stats.products }}</p>
        </div>
      </div>
      
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center hover:shadow-md transition-shadow">
        <div class="p-4 rounded-xl bg-emerald-50 text-emerald-600 mr-5 text-3xl">🛒</div>
        <div>
          <p class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Item Terjual</p>
          <p class="text-3xl font-bold text-gray-800">{{ stats.transactions }}</p>
        </div>
      </div>
      
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center hover:shadow-md transition-shadow">
        <div class="p-4 rounded-xl bg-purple-50 text-purple-600 mr-5 text-3xl">💰</div>
        <div>
          <p class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Pendapatan</p>
          <p class="text-2xl font-bold text-gray-800">Rp {{ formatPrice(stats.revenue) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const stats = ref({
  products: 0,
  transactions: 0,
  revenue: 0
});

const formatPrice = (price) => {
  return Number(price).toLocaleString('id-ID');
};

onMounted(async () => {
  try {
    const [productsRes, transactionsRes] = await Promise.all([
      api.get('/products'),
      api.get('/transactions')
    ]);
    
    stats.value.products = productsRes.data.length;
    stats.value.transactions = transactionsRes.data.reduce((sum, t) => sum + t.qty, 0); 
    stats.value.revenue = transactionsRes.data.reduce((sum, t) => sum + parseFloat(t.total_harga), 0);
  } catch (error) {
    console.error('Failed to fetch stats', error);
  }
});
</script>
