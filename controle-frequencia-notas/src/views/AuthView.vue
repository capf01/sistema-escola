// src/stores/auth.js
import { defineStore } from 'pinia'
import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth'
import { auth } from '@/firebase' // Agora importamos o auth diretamente

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    userData: null, // Para armazenar dados adicionais do Firestore
    isAuthenticated: false,
    loading: false,
    error: null
  }),
  getters: {
    isAdmin: (state) => {
      return state.userData?.role === 'admin'
    },
    isTeacher: (state) => {
      return state.userData?.role === 'teacher'
    },
    userName: (state) => state.user?.displayName || null,
    userEmail: (state) => state.user?.email || null
  },
  actions: {
    async login({ email, password }) {
      this.loading = true
      this.error = null
      
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        this.user = userCredential.user
        this.isAuthenticated = true
        
        // Carrega dados adicionais do usuário do Firestore
        await this.fetchUserData(userCredential.user.uid)
        
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
      
      try {
        // 1. Criar usuário no Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        
        // 2. Atualizar o nome do usuário
        await updateProfile(userCredential.user, { displayName: name })
        
        // 3. Adicionar informações adicionais no Firestore
        await this.addUserToFirestore(userCredential.user.uid, { email, name, role })
        
        this.user = userCredential.user
        this.userData = { email, name, role }
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
      this.userData = null
      this.isAuthenticated = false
      this.error = null
    },
    
    // Monitorar estado de autenticação
    initAuthListener() {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          this.user = user
          this.isAuthenticated = true
          await this.fetchUserData(user.uid)
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
    },
    
    // Métodos para Firestore (implementação básica)
    async addUserToFirestore(uid, userData) {
      // Implemente a conexão com o Firestore aqui
      console.log('Adicionando usuário ao Firestore:', uid, userData)
      // Exemplo:
      // await setDoc(doc(db, "users", uid), userData)
    },
    
    async fetchUserData(uid) {
      // Implemente a busca no Firestore aqui
      console.log('Buscando dados do usuário:', uid)
      // Exemplo:
      // const docSnap = await getDoc(doc(db, "users", uid))
      // if (docSnap.exists()) {
      //   this.userData = docSnap.data()
      // }
    }
  },
  persist: true
})