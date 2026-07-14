<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[baseClass, variantClass, sizeClass, 'transition-all duration-200 font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed']"
    @click="$emit('click', $event)"
  >
    <svg v-if="loading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
    </svg>
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'primary' }, // primary, secondary, danger, outline, ghost
  size: { type: String, default: 'md' },         // sm, md, lg
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
})

defineEmits(['click'])

const baseClass = 'rounded-xl cursor-pointer'

const variantClass = computed(() => ({
  primary:   'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-emerald-500 hover:bg-emerald-600 text-white',
  danger:    'bg-red-500 hover:bg-red-600 text-white',
  outline:   'border border-slate-300 hover:bg-slate-50 text-slate-700',
  ghost:     'hover:bg-slate-100 text-slate-600',
  'outline-blue':  'border border-blue-600 text-blue-600 hover:bg-blue-50',
  'outline-red':   'border border-red-500 text-red-500 hover:bg-red-50',
}[props.variant]))

const sizeClass = computed(() => ({
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}[props.size]))
</script>
