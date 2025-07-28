<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
    <form @submit.prevent="handleLogin">
      <div class="mb-4">
        <label class="block text-gray-700 mb-2" for="email">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div class="mb-6">
        <label class="block text-gray-700 mb-2" for="password">Senha</label>
        <input
          id="password"
          v-model="password"
          type="password"
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div v-if="error" class="mb-4 text-red-500 text-sm">{{ error }}</div>
      <button
        type="submit"
        class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
        :disabled="loading"
      >
        {{ loading ? 'Carregando...' : 'Entrar' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { login, error, loading } = useAuth()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
  await login(email.value, password.value)
}
</script>