<template>
  <nav class="bg-blue-600 text-white shadow-lg">
    <div class="container mx-auto px-4 py-3 flex justify-between items-center">
      <router-link to="/" class="text-xl font-bold">Controle Escolar</router-link>
      <div class="flex items-center space-x-4">
        <span class="hidden md:inline">{{ user?.email }}</span>
        <button
          @click="handleLogout"
          class="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition duration-200 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sair
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'

const { user, logout } = useAuth()

const handleLogout = async () => {
  await logout()
}
</script>

<style scoped>
.navbar {
  background-color: rgb(37 99 235);
  color: white;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 700;
  color: inherit;
  text-decoration: none;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-email {
  display: none;
}

@media (min-width: 768px) {
  .user-email {
    display: inline;
  }
}

.logout-btn {
  padding: 0.5rem 1rem;
  background-color: rgb(239 68 68);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  transition-property: background-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

.logout-btn:hover {
  background-color: rgb(220 38 38);
}

.icon {
  height: 1.25rem;
  width: 1.25rem;
  margin-right: 0.25rem;
}
</style>