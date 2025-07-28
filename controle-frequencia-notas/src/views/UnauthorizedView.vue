<template>
  <div class="unauthorized-container">
    <div class="unauthorized-content">
      <div class="error-icon">
        <i class="fas fa-ban"></i>
      </div>
      <h1 class="error-title">Acesso Não Autorizado</h1>
      <p class="error-message">
        Você não tem permissão para acessar esta página.
        <br>
        Entre em contato com o administrador do sistema se acredita que isto é um erro.
      </p>
      <div class="action-buttons">
        <router-link to="/" class="home-button">
          <i class="fas fa-home"></i> Página Inicial
        </router-link>
        <button @click="logout" class="logout-button">
          <i class="fas fa-sign-out-alt"></i> Sair
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.unauthorized-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 2rem;
}

.unauthorized-content {
  text-align: center;
  max-width: 600px;
  width: 100%;
  padding: 3rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.error-icon {
  font-size: 5rem;
  color: #f44336;
  margin-bottom: 1.5rem;
  animation: bounce 1.5s infinite;
}

.error-title {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.error-message {
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2.5rem;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2rem;
}

.home-button, .logout-button {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  text-decoration: none;
}

.home-button {
  background-color: #2196F3;
  color: white;
  border: 2px solid #2196F3;
}

.home-button:hover {
  background-color: #0b7dda;
  border-color: #0b7dda;
  transform: translateY(-2px);
}

.logout-button {
  background-color: white;
  color: #f44336;
  border: 2px solid #f44336;
  cursor: pointer;
}

.logout-button:hover {
  background-color: #f44336;
  color: white;
  transform: translateY(-2px);
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}

@media (max-width: 768px) {
  .unauthorized-content {
    padding: 2rem 1.5rem;
  }

  .error-icon {
    font-size: 4rem;
  }

  .error-title {
    font-size: 2rem;
  }

  .error-message {
    font-size: 1rem;
  }

  .action-buttons {
    flex-direction: column;
    gap: 1rem;
  }

  .home-button, .logout-button {
    width: 100%;
    justify-content: center;
  }
}
</style>