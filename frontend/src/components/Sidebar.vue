<template>
  <!-- ── Mobile backdrop ─────────────────────────────── -->
  <Transition name="backdrop">
    <div
      v-if="isMobileOpen"
      class="fixed inset-0 bg-black/50 z-30 lg:hidden"
      @click="closeMobile"
    />
  </Transition>

  <!-- ── Desktop sidebar ─────────────────────────────── -->
  <aside
    class="fixed top-0 left-0 h-full bg-white border-r border-indigo-100 hidden lg:flex flex-col z-20 transition-all duration-300 ease-in-out items-center py-4 gap-2"
    :class="isCollapsed ? 'w-16' : 'w-60'"
  >
    <SidebarContent />
  </aside>

  <!-- ── Mobile drawer ───────────────────────────────── -->
  <Transition name="drawer">
    <aside
      v-if="isMobileOpen"
      class="fixed top-0 left-0 h-full w-64 bg-white border-r border-indigo-100 flex flex-col z-40 py-4 gap-2 lg:hidden items-center"
    >
      <!-- Close button -->
      <button
        @click="closeMobile"
        class="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
      >
        <X class="w-4 h-4" />
      </button>

      <SidebarContent :force-expanded="true" @nav-click="closeMobile" />
    </aside>
  </Transition>
</template>

<script setup>
import { X } from '@lucide/vue'
import { useSidebar } from '../composables/useSidebar'
import SidebarContent from './SidebarContent.vue'

const { isCollapsed, isMobileOpen, closeMobile } = useSidebar()
</script>

<style scoped>
.backdrop-enter-active,
.backdrop-leave-active { transition: opacity 0.25s ease; }
.backdrop-enter-from,
.backdrop-leave-to     { opacity: 0; }

.drawer-enter-active,
.drawer-leave-active   { transition: transform 0.3s ease; }
.drawer-enter-from,
.drawer-leave-to       { transform: translateX(-100%); }
</style>
