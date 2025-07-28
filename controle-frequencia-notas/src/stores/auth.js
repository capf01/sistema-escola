import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false
  }),
  actions: {
    login(userData) {
      this.user = userData.user
      this.token = userData.token
      this.isAuthenticated = true
    },
    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
    }
  },
  persist: true // Optional: if using pinia-plugin-persistedstate
})