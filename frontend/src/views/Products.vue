<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Master Produk</h1>
      <button @click="openModal()" class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center">
        <span class="mr-2 text-lg leading-none">+</span> Tambah Produk
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm uppercase tracking-wider">
            <th class="p-4 font-semibold">Nama Produk</th>
            <th class="p-4 font-semibold">Harga</th>
            <th class="p-4 font-semibold">Stok</th>
            <th class="p-4 font-semibold text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50 transition-colors">
            <td class="p-4 text-gray-800 font-medium">{{ product.nama_produk }}</td>
            <td class="p-4 text-gray-600">Rp {{ formatPrice(product.harga) }}</td>
            <td class="p-4">
              <span class="px-3 py-1 rounded-full text-xs font-bold" :class="product.stok > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                {{ product.stok }}
              </span>
            </td>
            <td class="p-4 text-right space-x-4">
              <button @click="openModal(product)" class="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">Edit</button>
              <button @click="confirmDelete(product.id)" class="text-red-600 hover:text-red-800 font-medium text-sm transition-colors">Hapus</button>
            </td>
          </tr>
          <tr v-if="products.length === 0">
            <td colspan="4" class="p-8 text-center text-gray-500">Belum ada produk. Tambahkan produk pertama Anda.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl transform transition-all">
        <h2 class="text-xl font-bold text-gray-800 mb-6">{{ isEdit ? 'Edit Produk' : 'Tambah Produk' }}</h2>
        <form @submit.prevent="saveProduct" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Nama Produk</label>
            <input v-model="form.nama_produk" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-shadow" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Harga (Rp)</label>
            <input v-model.number="form.harga" type="number" min="0" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-shadow" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Stok</label>
            <input v-model.number="form.stok" type="number" min="0" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-shadow" />
          </div>
          <div class="flex justify-end space-x-3 mt-8 pt-4 border-t border-gray-100">
            <button type="button" @click="closeModal" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Batal</button>
            <button type="submit" :disabled="saving" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors shadow-sm disabled:opacity-70">
              {{ saving ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const products = ref([]);
const isModalOpen = ref(false);
const isEdit = ref(false);
const saving = ref(false);
const form = ref({ id: null, nama_produk: '', harga: 0, stok: 0 });

const formatPrice = (price) => Number(price).toLocaleString('id-ID');

const fetchProducts = async () => {
  try {
    const res = await api.get('/products');
    products.value = res.data;
  } catch (error) {
    console.error(error);
  }
};

const openModal = (product = null) => {
  if (product) {
    isEdit.value = true;
    form.value = { ...product };
  } else {
    isEdit.value = false;
    form.value = { id: null, nama_produk: '', harga: 0, stok: 0 };
  }
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const saveProduct = async () => {
  saving.value = true;
  try {
    if (isEdit.value) {
      await api.put(`/products/${form.value.id}`, form.value);
    } else {
      await api.post('/products', form.value);
    }
    await fetchProducts();
    closeModal();
  } catch (error) {
    console.error(error);
    alert('Gagal menyimpan produk');
  } finally {
    saving.value = false;
  }
};

const confirmDelete = async (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
    try {
      await api.delete(`/products/${id}`);
      await fetchProducts();
    } catch (error) {
      console.error(error);
      alert('Gagal menghapus produk');
    }
  }
};

onMounted(fetchProducts);
</script>
