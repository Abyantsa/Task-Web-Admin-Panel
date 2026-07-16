<template>
  <!-- Profile avatar -->
  <div class="w-full px-2 mb-1 shrink-0">
    <div class="flex items-center gap-3 px-2 py-2 rounded-2xl" :class="collapsed ? 'justify-center' : ''">
      <div class="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-sm font-bold uppercase text-white shrink-0">
        {{ user?.username?.charAt(0) ?? '?' }}
      </div>
      <div v-if="!collapsed" class="flex-1 min-w-0">
        <p class="text-sm font-semibold text-gray-800 truncate">{{ user?.username }}</p>
        <p class="text-xs text-indigo-400 capitalize">{{ user?.role }}</p>
      </div>
    </div>
  </div>

  <!-- Divider -->
  <div class="w-8 h-px bg-indigo-100 mb-1 shrink-0"></div>

  <!-- Menu -->
  <nav class="flex-1 flex flex-col gap-1 w-full px-2">
    <div v-for="item in menuItems" :key="item.path" class="relative group">
      <RouterLink
        :to="item.path"
        @click="$emit('nav-click')"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-150 text-sm font-semibold"
        :class="[
          collapsed ? 'justify-center' : '',
          isActive(item.path)
            ? 'bg-indigo-800 text-white'
            : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-700'
        ]"
      >
        <component :is="item.icon" class="w-5 h-5 shrink-0" />
        <span v-if="!collapsed" class="whitespace-nowrap tracking-wide">
          {{ item.label.toUpperCase() }}
        </span>
      </RouterLink>

      <!-- Tooltip saat collapsed (desktop only) -->
      <div
        v-if="collapsed"
        class="absolute left-full top-0 bottom-0 ml-3 my-auto h-fit flex items-center px-4 py-2.5 bg-indigo-800 text-white text-sm font-semibold rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50 shadow-xl shadow-indigo-200"
      >
        <span class="absolute right-full top-1/2 -translate-y-1/2 border-[7px] border-transparent border-r-indigo-800"></span>
        {{ item.label.toUpperCase() }}
      </div>
    </div>
  </nav>

  <!-- Divider -->
  <div class="w-8 h-px bg-indigo-100 shrink-0"></div>

  <!-- Logout -->
  <div class="w-full px-2 shrink-0">
    <div class="relative group">
      <button
        @click="logout"
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        :class="collapsed ? 'justify-center' : ''"
      >
        <LogOut class="w-5 h-5 shrink-0" />
        <span v-if="!collapsed" class="whitespace-nowrap tracking-wide">LOGOUT</span>
      </button>

      <!-- Tooltip logout saat collapsed -->
      <div
        v-if="collapsed"
        class="absolute left-full top-0 bottom-0 ml-3 my-auto h-fit flex items-center px-4 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50 shadow-xl"
      >
        <span class="absolute right-full top-1/2 -translate-y-1/2 border-[7px] border-transparent border-r-red-600"></span>
        LOGOUT
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { LayoutDashboard, Package, ShoppingCart, LogOut } from '@lucide/vue'
import { useSidebar } from '../composables/useSidebar'

const props = defineProps({
  forceExpanded: { type: Boolean, default: false },
})

defineEmits(['nav-click'])

const route  = useRoute()
const router = useRouter()
const { isCollapsed } = useSidebar()

// Di mobile drawer selalu expanded
const collapsed = computed(() => props.forceExpanded ? false : isCollapsed.value)

const user = computed(() => {
  const raw = localStorage.getItem('user')
  return raw ? JSON.parse(raw) : null
})

const menuItems = [
  { path: '/',             icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/products',     icon: Package,         label: 'Produk'    },
  { path: '/transactions', icon: ShoppingCart,    label: 'Transaksi' },
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
