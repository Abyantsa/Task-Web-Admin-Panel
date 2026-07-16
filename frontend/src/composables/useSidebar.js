import { ref } from 'vue'

// Singleton state — shared across all components
const isCollapsed = ref(localStorage.getItem('sidebar-collapsed') === 'true')

export function useSidebar() {
  function toggle() {
    isCollapsed.value = !isCollapsed.value
    localStorage.setItem('sidebar-collapsed', isCollapsed.value)
  }

  return { isCollapsed, toggle }
}
