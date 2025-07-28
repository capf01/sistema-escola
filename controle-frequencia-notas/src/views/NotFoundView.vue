<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="error-illustration">
        <div class="error-number">4</div>
        <div class="error-icon">
          <i class="fas fa-question-circle"></i>
        </div>
        <div class="error-number">4</div>
      </div>
      <h1 class="error-title">Página Não Encontrada</h1>
      <p class="error-message">
        Oops! A página que você está procurando não existe ou foi movida.
        <br>
        Verifique o URL ou navegue usando o menu.
      </p>
      <div class="action-buttons">
        <router-link to="/" class="home-button">
          <i class="fas fa-home"></i> Voltar à Página Inicial
        </router-link>
        <button @click="goBack" class="back-button">
          <i class="fas fa-arrow-left"></i> Voltar à Página Anterior
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 2rem;
}

.not-found-content {
  text-align: center;
  max-width: 700px;
  width: 100%;
  padding: 3rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.error-illustration {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.error-number {
  font-size: 6rem;
  font-weight: 800;
  color: #3f51b5;
  line-height: 1;
}

.error-icon {
  font-size: 4rem;
  color: #ff9800;
  animation: pulse 2s infinite;
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

.home-button, .back-button {
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
  background-color: #3f51b5;
  color: white;
  border: 2px solid #3f51b5;
}

.home-button:hover {
  background-color: #303f9f;
  border-color: #303f9f;
  transform: translateY(-2px);
}

.back-button {
  background-color: white;
  color: #3f51b5;
  border: 2px solid #3f51b5;
  cursor: pointer;
}

.back-button:hover {
  background-color: #e8eaf6;
  transform: translateY(-2px);
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .not-found-content {
    padding: 2rem 1.5rem;
  }

  .error-illustration {
    gap: 0.5rem;
  }

  .error-number {
    font-size: 4rem;
  }

  .error-icon {
    font-size: 3rem;
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

  .home-button, .back-button {
    width: 100%;
    justify-content: center;
  }
}
</style>