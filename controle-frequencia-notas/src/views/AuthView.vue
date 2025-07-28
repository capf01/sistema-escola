<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('admin') // Valor padrão para email
const password = ref('admin') // Valor padrão para senha
const rememberMe = ref(false)

const handleLogin = async () => {
  // Verificação simples para o login admin
  if (email.value === 'admin' && password.value === 'admin') {
    // Simula um login bem-sucedido
    authStore.user = { name: 'Administrador', email: 'admin' }
    router.push('/')
  } else {
    // Se não for admin, chama o método normal de login
    await authStore.login(email.value, password.value)
    
    if (authStore.user) {
      router.push('/')
    }
  }
}

const signInWithGoogle = async () => {
  // Implementar login com Google se necessário
  console.log('Login com Google')
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  padding: 3rem 1rem;
}

.login-content {
  max-width: 28rem;
  width: 100%;
}

.login-header {
  text-align: center;
}

.login-title {
  margin-top: 1.5rem;
  font-size: 1.875rem;
  font-weight: 800;
  color: #111827;
}

.login-subtitle {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.login-form-container {
  margin-top: 2rem;
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.error-message {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: #fef2f2;
  color: #b91c1c;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.login-form {
  margin-top: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.input-container {
  margin-top: 0.25rem;
}

.form-input {
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  font-size: 0.875rem;
  color: #111827;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.remember-me {
  display: flex;
  align-items: center;
}

.remember-checkbox {
  height: 1rem;
  width: 1rem;
  color: #3b82f6;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  margin-right: 0.5rem;
}

.remember-checkbox:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.remember-label {
  font-size: 0.875rem;
  color: #374151;
}

.forgot-link {
  font-size: 0.875rem;
  font-weight: 500;
  color: #3b82f6;
  text-decoration: none;
}

.forgot-link:hover {
  color: #2563eb;
}

.submit-button-container {
  margin-top: 1.5rem;
}

.submit-button {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}

.submit-button:hover:not(:disabled) {
  background-color: #2563eb;
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-spinner {
  height: 1.25rem;
  width: 1.25rem;
  animation: spin 1s linear infinite;
}

.spinner-circle {
  opacity: 0.25;
}

.spinner-path {
  opacity: 0.75;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.social-divider {
  display: flex;
  align-items: center;
  margin-top: 1.5rem;
}

.divider-line {
  flex: 1;
  height: 1px;
  background-color: #d1d5db;
}

.divider-text {
  padding: 0 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.social-buttons {
  margin-top: 1.5rem;
}

.google-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0.5rem 1rem;
  background-color: white;
  color: #6b7280;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}

.google-button:hover {
  background-color: #f9fafb;
}

.google-icon {
  height: 1.25rem;
  width: 1.25rem;
  margin-right: 0.5rem;
}

.google-button-text {
  margin-left: 0.5rem;
}
</style>