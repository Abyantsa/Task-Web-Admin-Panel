<template>
  <div class="max-w-5xl mx-auto">
    <div class="flex items-center mb-6">
      <router-link to="/transactions" class="text-gray-500 hover:text-gray-800 mr-4 transition-colors">
        ← Kembali
      </router-link>
      <h1 class="text-2xl font-bold text-gray-800">Kasir / Buat Transaksi</h1>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-lg font-bold text-gray-800 mb-4">Pilih Produk</h2>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
            <div v-for="product in products" :key="product.id" 
              @click="addToCart(product)"
              class="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-emerald-500 hover:shadow-md transition-all"
              :class="{'opacity-50 cursor-not-allowed': product.stok === 0}">
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-semibold text-gray-800">{{ product.nama_produk }}</h3>
                <span class="text-xs font-bold px-2 py-1 rounded-full" :class="product.stok > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                  Sisa: {{ product.stok }}
                </span>
              </div>
              <p class="text-emerald-600 font-bold">Rp {{ formatPrice(product.harga) }}</p>
            </div>
          </div>
          
          <div v-if="products.length === 0" class="text-center py-8 text-gray-500">
            Tidak ada produk. Silakan tambahkan di menu Produk.
          </div>
        </div>
      </div>

      <div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
          <div class="p-4 border-b border-gray-100 bg-gray-50 rounded-t-xl">
            <h2 class="text-lg font-bold text-gray-800">Keranjang</h2>
          </div>
          
          <div class="p-4 flex-1 overflow-y-auto max-h-[400px]">
            <div v-if="cart.length === 0" class="text-center text-gray-400 py-10">
              Keranjang masih kosong
            </div>
            
            <div v-for="(item, index) in cart" :key="item.product.id" class="mb-4 pb-4 border-b border-gray-50 last:border-0">
              <div class="flex justify-between items-start mb-2">
                <h4 class="font-medium text-gray-800 text-sm">{{ item.product.nama_produk }}</h4>
                <button @click="removeFromCart(index)" class="text-red-500 hover:text-red-700 text-xs font-medium">Hapus</button>
              </div>
              
              <div class="flex justify-between items-center">
                <div class="flex items-center space-x-2">
                  <button @click="updateQty(index, -1)" class="w-6 h-6 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold" :disabled="item.qty <= 1">-</button>
                  <span class="text-sm font-semibold w-6 text-center">{{ item.qty }}</span>
                  <button @click="updateQty(index, 1)" class="w-6 h-6 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold" :disabled="item.qty >= item.product.stok">+</button>
                </div>
                <div class="font-semibold text-gray-800 text-sm">
                  Rp {{ formatPrice(item.product.harga * item.qty) }}
                </div>
              </div>
            </div>
          </div>
          
          <div class="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
            <div class="flex justify-between items-center mb-4">
              <span class="text-gray-600 font-medium">Total Harga</span>
              <span class="text-xl font-bold text-emerald-600">Rp {{ formatPrice(totalPrice) }}</span>
            </div>
            
            <button @click="checkout" :disabled="cart.length === 0 || processing" 
              class="w-full py-3 rounded-lg font-bold text-white shadow-md transition-colors"
              :class="cart.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'">
              {{ processing ? 'Memproses...' : 'Proses Pembayaran' }}
            </button>
            <div v-if="errorMsg" class="mt-2 text-red-500 text-xs text-center font-medium">{{ errorMsg }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();
const products = ref([]);
const cart = ref([]);
const processing = ref(false);
const errorMsg = ref('');

const formatPrice = (price) => Number(price).toLocaleString('id-ID');

onMounted(async () => {
  try {
    const res = await api.get('/products');
    products.value = res.data;
  } catch (error) {
    console.error('Failed to fetch products', error);
  }
});

const addToCart = (product) => {
  if (product.stok === 0) return;
  
  const existingItem = cart.value.find(item => item.product.id === product.id);
  if (existingItem) {
    if (existingItem.qty < product.stok) {
      existingItem.qty++;
    }
  } else {
    cart.value.push({ product, qty: 1 });
  }
};

const updateQty = (index, delta) => {
  const item = cart.value[index];
  const newQty = item.qty + delta;
  if (newQty > 0 && newQty <= item.product.stok) {
    item.qty = newQty;
  }
};

const removeFromCart = (index) => {
  cart.value.splice(index, 1);
};

const totalPrice = computed(() => {
  return cart.value.reduce((sum, item) => sum + (item.product.harga * item.qty), 0);
});

const checkout = async () => {
  if (cart.value.length === 0) return;
  
  processing.value = true;
  errorMsg.value = '';
  
  const items = cart.value.map(item => ({
    produk_id: item.product.id,
    qty: item.qty
  }));
  
  try {
    await api.post('/transactions', { items });
    alert('Transaksi berhasil disimpan!');
    router.push('/transactions');
  } catch (error) {
    console.error(error);
    errorMsg.value = error.response?.data?.message || 'Gagal memproses transaksi';
  } finally {
    processing.value = false;
  }
};
</script>
