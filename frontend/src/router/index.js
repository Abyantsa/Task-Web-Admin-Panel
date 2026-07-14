import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

import Layout from '../components/Layout.vue';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import Products from '../views/Products.vue';
import Transactions from '../views/Transactions.vue';
import CreateTransaction from '../views/CreateTransaction.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'Dashboard', component: Dashboard },
      { path: 'products', name: 'Products', component: Products },
      { path: 'transactions', name: 'Transactions', component: Transactions },
      { path: 'transactions/new', name: 'CreateTransaction', component: CreateTransaction },
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;
