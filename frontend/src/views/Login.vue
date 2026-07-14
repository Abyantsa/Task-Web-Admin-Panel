<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 font-sans">
    <div class="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
      <!-- Decorative element -->
      <div class="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
      
      <div class="text-center mb-8 mt-2">
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">AdminPanel</h1>
        <p class="text-sm text-gray-500 mt-2">Masuk untuk mengelola sistem kasir</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Username</label>
          <input v-model="username" type="text" required 
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors shadow-sm outline-none" 
            placeholder="Masukkan username" />
        </div>
        
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Password</label>
          <input v-model="password" type="password" required 
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors shadow-sm outline-none" 
            placeholder="Masukkan password" />
        </div>
        
        <div v-if="error" class="text-red-600 text-sm font-medium text-center bg-red-50 p-3 rounded-lg border border-red-100">
          {{ error }}
        </div>
        
        <button type="submit" :disabled="loading" 
          class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-70">
          <span v-if="loading">Memproses...</span>
          <span v-else>Login</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const username = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleLogin = async () => {
  error.value = '';
  loading.value = true;
  
  try {
    await authStore.login(username.value, password.value);
    router.push('/');
  } catch (err) {
    error.value = err.response?.data?.message || 'Gagal login. Periksa kembali kredensial Anda.';
  } finally {
    loading.value = false;
  }
};
</script>
