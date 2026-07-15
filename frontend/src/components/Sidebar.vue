<template>
  <aside class="fixed top-0 left-0 h-full w-60 bg-indigo-700 text-white flex flex-col z-20">
    <!-- Profile di atas -->
    <div class="px-4 py-5 border-b border-indigo-600">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold uppercase shrink-0">
          {{ user?.username?.charAt(0) ?? '?' }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold truncate">{{ user?.username }}</p>
          <p class="text-xs text-indigo-300 capitalize">{{ user?.role }}</p>
        </div>
      </div>
    </div>

    <!-- Menu -->
    <nav class="flex-1 px-3 py-4 space-y-1">
      <RouterLink
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
        :class="isActive(item.path)
          ? 'bg-indigo-800 text-white'
          : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'"
      >
        <component :is="item.icon" class="w-5 h-5 shrink-0" />
        {{ item.label }}
      </RouterLink>
    </nav>

    <!-- Logout -->
    <div class="px-4 py-4 border-t border-indigo-600">
      <button
        @click="logout"
        class="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-pink-500 hover:text-white transition-colors"
      >
        <LogOut class="w-5 h-5" /> Logout
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { LayoutDashboard, Package, ShoppingCart, LogOut } from '@lucide/vue'

const route  = useRoute()
const router = useRouter()

const user = computed(() => {
  const raw = localStorage.getItem('user')
  return raw ? JSON.parse(raw) : null
})

const menuItems = [
  { path: '/',             icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/products',     icon: Package,         label: 'Produk' },
  { path: '/transactions', icon: ShoppingCart,         label: 'Transaksi' },
]

function isActive(path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login?logout=true')
}
</script>
