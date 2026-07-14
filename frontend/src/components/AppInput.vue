<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-sm font-semibold text-slate-700">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <span v-if="$slots.prefix" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        <slot name="prefix" />
      </span>
      <input
        v-bind="$attrs"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          'w-full rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'transition-all duration-200 disabled:bg-slate-50 disabled:cursor-not-allowed',
          $slots.prefix ? 'pl-10' : 'pl-4',
          'py-2.5 pr-4 text-sm'
        ]"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>
    <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: String,
  placeholder: String,
  type: { type: String, default: 'text' },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  error: String,
})
defineEmits(['update:modelValue'])
</script>
