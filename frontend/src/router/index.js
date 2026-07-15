import { createRouter, createWebHistory } from 'vue-router'
import LoginView      from '../views/LoginView.vue'
import DashboardView  from '../views/DashboardView.vue'
import ProdukView     from '../views/ProdukView.vue'
import TransaksiView  from '../views/TransaksiView.vue'

const routes = [
  { path: '/login', name: 'Login', component: LoginView, meta: { public: true } },
  { path: '/',      name: 'Dashboard',  component: DashboardView },
  { path: '/products',     name: 'Produk',    component: ProdukView },
  { path: '/transactions', name: 'Transaksi', component: TransaksiView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard — redirect ke login kalau belum ada token
router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  if (!to.meta.public && !token) {
    return { name: 'Login' }
  }
  if (to.name === 'Login' && token) {
    return { name: 'Dashboard' }
  }
})

export default router
