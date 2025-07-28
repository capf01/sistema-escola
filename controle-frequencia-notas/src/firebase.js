// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);