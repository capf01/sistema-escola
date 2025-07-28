<template>
  <!-- Barra lateral para desktop -->
  <div class="hidden md:flex md:flex-shrink-0">
    <div class="flex flex-col w-64 border-r border-gray-200 bg-white">
      <!-- Logo e cabeçalho -->
      <div class="h-16 flex items-center px-4 border-b border-gray-200">
        <router-link to="/" class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span class="ml-2 text-xl font-bold text-gray-800">EscolaPlus</span>
        </router-link>
      </div>
      
      <!-- Conteúdo da barra lateral -->
      <div class="flex-1 flex flex-col overflow-y-auto">
        <!-- Menu de navegação -->
        <nav class="flex-1 px-2 py-4 space-y-1">
          <!-- Dashboard -->
          <router-link 
            to="/"
            active-class="bg-blue-50 text-blue-600"
            class="group flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="mr-3 h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Dashboard
          </router-link>
          
          <!-- Alunos -->
          <router-link 
            to="/students"
            active-class="bg-blue-50 text-blue-600"
            class="group flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="mr-3 h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Alunos
          </router-link>
          
          <!-- Frequência -->
          <div>
            <button 
              @click="toggleAttendanceMenu"
              class="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors"
              :class="isAttendanceMenuOpen ? 'bg-blue-50 text-blue-600' : ''"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="mr-3 h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="flex-1 text-left">Frequência</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-4 w-4 transform transition-transform"
                :class="isAttendanceMenuOpen ? 'rotate-180' : ''"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div v-show="isAttendanceMenuOpen" class="pl-11 py-1 space-y-1">
                <router-link 
                  to="/attendance/register"
                  active-class="text-blue-600 font-medium"
                  class="block px-2 py-1 text-sm rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  Registrar
                </router-link>
                <router-link 
                  to="/attendance/history"
                  active-class="text-blue-600 font-medium"
                  class="block px-2 py-1 text-sm rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  Histórico
                </router-link>
              </div>
            </transition>
          </div>
          
          <!-- Notas -->
          <div>
            <button 
              @click="toggleGradesMenu"
              class="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors"
              :class="isGradesMenuOpen ? 'bg-blue-50 text-blue-600' : ''"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="mr-3 h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span class="flex-1 text-left">Notas</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-4 w-4 transform transition-transform"
                :class="isGradesMenuOpen ? 'rotate-180' : ''"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div v-show="isGradesMenuOpen" class="pl-11 py-1 space-y-1">
                <router-link 
                  to="/grades/register"
                  active-class="text-blue-600 font-medium"
                  class="block px-2 py-1 text-sm rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  Lançar
                </router-link>
                <router-link 
                  to="/grades/history"
                  active-class="text-blue-600 font-medium"
                  class="block px-2 py-1 text-sm rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  Boletins
                </router-link>
              </div>
            </transition>
          </div>
          
          <!-- Relatórios -->
          <router-link 
            to="/reports"
            active-class="bg-blue-50 text-blue-600"
            class="group flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="mr-3 h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Relatórios
          </router-link>
        </nav>
        
        <!-- Perfil e logout -->
        <div class="p-4 border-t border-gray-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span class="text-blue-600 font-medium">
                  {{ userInitials }}
                </span>
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-700">{{ userName }}</p>
              <button 
                @click="logout"
                class="text-xs font-medium text-blue-600 hover:text-blue-500"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Mobile sidebar (off-canvas) -->
  <div class="md:hidden">
    <div 
      v-show="isMobileSidebarOpen"
      class="fixed inset-0 z-40"
    >
      <div 
        class="fixed inset-0 bg-gray-600 bg-opacity-75"
        @click="isMobileSidebarOpen = false"
      ></div>
      
      <div class="relative flex flex-col w-full max-w-xs bg-white">
        <div class="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div class="flex items-center justify-between px-4">
            <router-link to="/" class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span class="ml-2 text-xl font-bold text-gray-800">EscolaPlus</span>
            </router-link>
            <button 
              @click="isMobileSidebarOpen = false"
              class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <svg class="h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <nav class="mt-5 px-2 space-y-1">
            <!-- Itens do menu mobile (simplificado) -->
            <router-link 
              to="/"
              active-class="bg-blue-50 text-blue-600"
              class="group flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-blue-50 hover:text-blue-600"
              @click.native="isMobileSidebarOpen = false"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="mr-4 h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Dashboard
            </router-link>
            
            <router-link 
              to="/students"
              active-class="bg-blue-50 text-blue-600"
              class="group flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-blue-50 hover:text-blue-600"
              @click.native="isMobileSidebarOpen = false"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="mr-4 h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Alunos
            </router-link>
            
            <router-link 
              to="/attendance"
              active-class="bg-blue-50 text-blue-600"
              class="group flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-blue-50 hover:text-blue-600"
              @click.native="isMobileSidebarOpen = false"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="mr-4 h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Frequência
            </router-link>
            
            <router-link 
              to="/grades"
              active-class="bg-blue-50 text-blue-600"
              class="group flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-blue-50 hover:text-blue-600"
              @click.native="isMobileSidebarOpen = false"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="mr-4 h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Notas
            </router-link>
            
            <router-link 
              to="/reports"
              active-class="bg-blue-50 text-blue-600"
              class="group flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-blue-50 hover:text-blue-600"
              @click.native="isMobileSidebarOpen = false"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="mr-4 h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Relatórios
            </router-link>
          </nav>
        </div>
        
        <div class="p-4 border-t border-gray-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span class="text-blue-600 font-medium">
                  {{ userInitials }}
                </span>
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-700">{{ userName }}</p>
              <button 
                @click="logout"
                class="text-xs font-medium text-blue-600 hover:text-blue-500"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const { user, logout } = useAuth()
const router = useRouter()

// Estado dos menus dropdown
const isAttendanceMenuOpen = ref(false)
const isGradesMenuOpen = ref(false)
const isMobileSidebarOpen = ref(false)

// Iniciais do usuário para o avatar
const userInitials = computed(() => {
  if (!user.value?.displayName) return 'US'
  const names = user.value.displayName.split(' ')
  const first = names[0] ? names[0][0] : ''
  const last = names.length > 1 ? names[names.length - 1][0] : ''
  return `${first}${last}`.toUpperCase()
})

// Nome do usuário
const userName = computed(() => {
  return user.value?.displayName || user.value?.email || 'Usuário'
})

// Alternar menus
const toggleAttendanceMenu = () => {
  isAttendanceMenuOpen.value = !isAttendanceMenuOpen.value
  if (isGradesMenuOpen.value) isGradesMenuOpen.value = false
}

const toggleGradesMenu = () => {
  isGradesMenuOpen.value = !isGradesMenuOpen.value
  if (isAttendanceMenuOpen.value) isAttendanceMenuOpen.value = false
}

// Logout
const handleLogout = async () => {
  await logout()
  router.push('/login')
}

// Expor função para abrir o sidebar mobile
const openMobileSidebar = () => {
  isMobileSidebarOpen.value = true
}

// Expor para o componente pai
defineExpose({
  openMobileSidebar
})
</script>

<style scoped>
/* Transições suaves para os menus dropdown */
.slide-enter-active, .slide-leave-active {
  transition: all 0.2s;
}
.slide-enter-from, .slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>