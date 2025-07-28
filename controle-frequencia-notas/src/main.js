import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'

// Firebase
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC2BeREwbJDXzwbf8ZHCS5K4B_1ZPj1IAQ",
  authDomain: "controle-frequencia-notas.firebaseapp.com",
  projectId: "controle-frequencia-notas",
  storageBucket: "controle-frequencia-notas.firebasestorage.app",
  messagingSenderId: "880865678881",
  appId: "1:880865678881:web:63b85800cbf5a2b373b560",
  measurementId: "G-Y3W4BTBWBJ"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)
const auth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp)

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Provide Firebase instances to the app
app.provide('auth', auth)
app.provide('db', db)

app.mount('#app')