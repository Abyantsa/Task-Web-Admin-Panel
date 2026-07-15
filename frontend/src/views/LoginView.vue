<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="w-full max-w-sm">
      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-lg px-8 py-10">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span class="text-white text-2xl font-bold">AP</span>
          </div>
          <h1 class="text-2xl font-bold text-gray-800">Admin Panel</h1>
          <p class="text-sm text-gray-500 mt-1">Masuk untuk melanjutkan</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
            <input
              v-model="form.username"
              type="text"
              placeholder="Masukkan username"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              :disabled="loading"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input
              v-model="form.password"
              type="password"
              placeholder="Masukkan password"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              :disabled="loading"
            />
          </div>

          <!-- Error -->
          <div v-if="errorMsg" class="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
            {{ errorMsg }}
          </div>

          <button
            type="submit"
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="loading"
          >
            {{ loading ? 'Memproses...' : 'Masuk' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api'
import { useToast } from '../composables/useToast'

const router        = useRouter()
const route         = useRoute()
const loading       = ref(false)
const errorMsg      = ref('')
const { showToast } = useToast()

const form = ref({ username: '', password: '' })

async function handleLogin() {
  errorMsg.value = ''

  if (!form.value.username || !form.value.password) {
    errorMsg.value = 'Username dan password wajib diisi'
    return
  }

  loading.value = true
  try {
    const res = await api.post('/auth/login', form.value)
    const { token, user } = res.data.data

    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))

    router.push('/?login=true')
  } catch (err) {
    errorMsg.value = err.response?.data?.message ?? 'Terjadi kesalahan, coba lagi'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (route.query.logout === 'true') {
    showToast('Berhasil logout. Sampai jumpa!', 'info')
  }
})
</script>
