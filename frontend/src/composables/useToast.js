import { reactive } from 'vue'

const state = reactive({
  toasts: [],
})

let idCounter = 0

export function useToast() {
  function showToast(message, type = 'success', duration = 3000) {
    const id = ++idCounter
    state.toasts.push({ id, message, type })

    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  function removeToast(id) {
    const index = state.toasts.findIndex(t => t.id === id)
    if (index !== -1) state.toasts.splice(index, 1)
  }

  return {
    toasts: state.toasts,
    showToast,
    removeToast,
  }
}
