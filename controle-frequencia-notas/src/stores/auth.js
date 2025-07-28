import { defineStore } from 'pinia'
import { 
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth'
import { firebaseApp } from '@/firebase' // Importe sua configuração do Firebase

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  }),
  getters: {
    isAdmin: (state) => {
      // Implemente sua lógica de admin (pode ser baseada em custom claims)
      return state.user?.isAdmin || false
    },
    userName: (state) => state.user?.displayName || null,
    userEmail: (state) => state.user?.email || null
  },
  actions: {
    async login({ email, password }) {
      this.loading = true
      this.error = null
      const auth = getAuth(firebaseApp)
      
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        this.user = userCredential.user
        this.isAuthenticated = true
        return true
      } catch (error) {
        this.error = this.translateFirebaseError(error.code)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async register({ email, password, name, role = 'student' }) {
      this.loading = true
      this.error = null
      const auth = getAuth(firebaseApp)
      
      try {
        // 1. Criar usuário no Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        
        // 2. Atualizar o nome do usuário
        await updateProfile(userCredential.user, { displayName: name })
        
        // 3. Adicionar informações adicionais no seu banco de dados (Firestore)
        // await this.addUserToDatabase(userCredential.user.uid, { email, name, role })
        
        this.user = { ...userCredential.user, role }
        this.isAuthenticated = true
        return true
      } catch (error) {
        this.error = this.translateFirebaseError(error.code)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async logout() {
      const auth = getAuth(firebaseApp)
      try {
        await signOut(auth)
        this.clearAuth()
      } catch (error) {
        this.error = this.translateFirebaseError(error.code)
        throw error
      }
    },
    
    clearAuth() {
      this.user = null
      this.isAuthenticated = false
      this.error = null
    },
    
    // Monitorar estado de autenticação
    initAuthListener() {
      const auth = getAuth(firebaseApp)
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.user = user
          this.isAuthenticated = true
        } else {
          this.clearAuth()
        }
      })
    },
    
    // Traduzir erros do Firebase
    translateFirebaseError(code) {
      const errors = {
        'auth/invalid-email': 'E-mail inválido',
        'auth/user-disabled': 'Usuário desativado',
        'auth/user-not-found': 'Usuário não encontrado',
        'auth/wrong-password': 'Senha incorreta',
        'auth/email-already-in-use': 'E-mail já está em uso',
        'auth/weak-password': 'Senha muito fraca',
        'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.'
      }
      return errors[code] || 'Ocorreu um erro. Tente novamente.'
    }
  },
  persist: true // Se estiver usando pinia-plugin-persistedstate
})