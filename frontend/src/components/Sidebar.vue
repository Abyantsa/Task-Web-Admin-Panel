<template>
  <aside class="bg-gray-800 text-white w-64 min-h-screen flex flex-col transition-all duration-300 shadow-xl z-20">
    <div class="p-6 border-b border-gray-700">
      <h2 class="text-2xl font-bold text-center tracking-wider text-emerald-400">AdminPanel</h2>
    </div>
    <nav class="flex-1 px-4 space-y-2 mt-6">
      <router-link to="/" class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors" active-class="bg-gray-700 border-l-4 border-emerald-500">
        <span class="mr-3 text-xl">📊</span> <span class="font-medium">Dashboard</span>
      </router-link>
      <router-link to="/products" class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors" active-class="bg-gray-700 border-l-4 border-emerald-500">
        <span class="mr-3 text-xl">📦</span> <span class="font-medium">Master Produk</span>
      </router-link>
      <router-link to="/transactions" class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors" active-class="bg-gray-700 border-l-4 border-emerald-500">
        <span class="mr-3 text-xl">🛒</span> <span class="font-medium">Data Transaksi</span>
      </router-link>
      <router-link to="/transactions/new" class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors" active-class="bg-gray-700 border-l-4 border-emerald-500">
        <span class="mr-3 text-xl">💵</span> <span class="font-medium">Kasir Baru</span>
      </router-link>
    </nav>
  </aside>
</template>
