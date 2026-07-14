<template>
  <Teleport to="body">
    <div class="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto flex items-start gap-3 px-4 py-3.5 rounded-xl shadow-lg min-w-72 max-w-sm"
          :class="toastClass(toast.type)"
        >
          <!-- Icon -->
          <span class="text-lg shrink-0 mt-0.5">{{ toastIcon(toast.type) }}</span>

          <!-- Message -->
          <p class="text-sm font-medium flex-1 leading-snug">{{ toast.message }}</p>

          <!-- Close button -->
          <button
            @click="removeToast(toast.id)"
            class="shrink-0 opacity-60 hover:opacity-100 transition-opacity text-lg leading-none mt-0.5"
          >
            &times;
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useToast } from '../composables/useToast'

const { toasts, removeToast } = useToast()

function toastClass(type) {
  const map = {
    success: 'bg-emerald-50 border border-emerald-200 text-emerald-800',
    error:   'bg-red-50 border border-red-200 text-red-800',
    info:    'bg-blue-50 border border-blue-200 text-blue-800',
    warning: 'bg-amber-50 border border-amber-200 text-amber-800',
  }
  return map[type] ?? map.info
}

function toastIcon(type) {
  const map = {
    success: '✅',
    error:   '❌',
    info:    'ℹ️',
    warning: '⚠️',
  }
  return map[type] ?? 'ℹ️'
}
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease;
}
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(-16px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(40px) scale(0.95);
}
</style>
