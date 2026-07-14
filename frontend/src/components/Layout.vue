<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden font-sans">
    <Sidebar />
    <div class="flex-1 flex flex-col overflow-hidden">
      <Navbar />
      <main class="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-8">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from './Sidebar.vue';
import Navbar from './Navbar.vue';
</script>
