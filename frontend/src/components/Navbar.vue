<template>
  <header class="bg-white shadow-sm border-b border-gray-100 py-4 px-6 flex justify-end items-center z-10 relative">
    <div class="flex items-center space-x-6">
      <div class="text-sm font-medium text-gray-600">
        Halo, <span class="text-emerald-600 font-bold ml-1 text-base">{{ authStore.user?.username || 'Admin' }}</span>
      </div>
      <button @click="handleLogout" class="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center">
        <span class="mr-2">🚪</span> Logout
      </button>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>
