import { ref, computed, watch } from 'vue'

export function usePagination(sourceList, defaultPerPage = 5) {
  const currentPage = ref(1)
  const perPage     = ref(defaultPerPage)

  // Reset ke halaman 1 kalau data atau perPage berubah
  watch([sourceList, perPage], () => {
    currentPage.value = 1
  })

  const totalPages = computed(() => Math.max(1, Math.ceil(sourceList.value.length / perPage.value)))

  const paginatedList = computed(() => {
    const start = (currentPage.value - 1) * perPage.value
    return sourceList.value.slice(start, start + perPage.value)
  })

  const startIndex = computed(() => sourceList.value.length === 0 ? 0 : (currentPage.value - 1) * perPage.value + 1)
  const endIndex   = computed(() => Math.min(currentPage.value * perPage.value, sourceList.value.length))

  const pageNumbers = computed(() => {
    const total = totalPages.value
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

    const current = currentPage.value
    const pages   = []

    pages.push(1)
    if (current > 3) pages.push('...')

    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i)
    }

    if (current < total - 2) pages.push('...')
    pages.push(total)

    return pages
  })

  function goTo(page) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  function prev() { goTo(currentPage.value - 1) }
  function next() { goTo(currentPage.value + 1) }

  return {
    currentPage,
    perPage,
    totalPages,
    paginatedList,
    startIndex,
    endIndex,
    pageNumbers,
    goTo,
    prev,
    next,
  }
}
