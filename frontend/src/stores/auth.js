import { defineStore } from 'pinia';
import api from '../services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(username, password) {
      try {
        const response = await api.post('/auth/login', { username, password });
        this.user = response.data.user;
        this.token = response.data.token;
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
        return true;
      } catch (error) {
        console.error('Login failed', error);
        throw error;
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }
});
