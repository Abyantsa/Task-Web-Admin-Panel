import { ref } from 'vue'

// Singleton state — shared across all components
const isCollapsed  = ref(localStorage.getItem('sidebar-collapsed') === 'true')
const isMobileOpen = ref(false)

export function useSidebar() {
  function toggle() {
    isCollapsed.value = !isCollapsed.value
    localStorage.setItem('sidebar-collapsed', isCollapsed.value)
  }

  function openMobile()  { isMobileOpen.value = true  }
  function closeMobile() { isMobileOpen.value = false }

  return { isCollapsed, isMobileOpen, toggle, openMobile, closeMobile }
}
