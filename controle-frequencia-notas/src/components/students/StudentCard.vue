<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200">
    <!-- Cabeçalho com foto e nome -->
    <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-4 flex items-center">
      <div class="relative">
        <!-- Foto do aluno (placeholder se não tiver) -->
        <div class="h-16 w-16 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-white">
          <img 
            v-if="student.photoUrl"
            :src="student.photoUrl"
            :alt="`Foto de ${student.name}`"
            class="h-full w-full object-cover"
          >
          <span v-else class="text-2xl font-bold text-blue-600">
            {{ studentInitials }}
          </span>
        </div>
        <!-- Status (ativo/inativo) -->
        <span 
          class="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white"
          :class="student.active ? 'bg-green-500' : 'bg-red-500'"
          :title="student.active ? 'Ativo' : 'Inativo'"
        ></span>
      </div>
      
      <div class="ml-4">
        <h3 class="text-lg font-semibold text-white">{{ student.name }}</h3>
        <p class="text-sm text-blue-100">{{ student.registrationNumber }}</p>
      </div>
    </div>
    
    <!-- Corpo do cartão -->
    <div class="p-4">
      <!-- Informações básicas -->
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p class="text-xs text-gray-500">Turma</p>
          <p class="font-medium">{{ student.class || '--' }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-500">Nascimento</p>
          <p class="font-medium">{{ formattedBirthDate }}</p>
        </div>
      </div>
      
      <!-- Contatos -->
      <div class="mb-4">
        <p class="text-xs text-gray-500">Contato</p>
        <div class="flex items-center mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p class="text-sm">{{ student.email || '--' }}</p>
        </div>
        <div class="flex items-center mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <p class="text-sm">{{ student.phone || '--' }}</p>
        </div>
      </div>
      
      <!-- Ações rápidas -->
      <div class="border-t border-gray-200 pt-3">
        <div class="flex justify-between space-x-2">
          <!-- Botão de Frequência -->
          <button
            @click="openAttendance"
            class="flex-1 flex items-center justify-center px-2 py-1 bg-green-50 text-green-700 rounded text-sm hover:bg-green-100 transition-colors"
            title="Registrar frequência"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Frequência
          </button>
          
          <!-- Botão de Notas -->
          <button
            @click="openGrades"
            class="flex-1 flex items-center justify-center px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm hover:bg-blue-100 transition-colors"
            title="Lançar notas"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Notas
          </button>
          
          <!-- Botão de Editar -->
          <button
            @click="openEdit"
            class="flex-1 flex items-center justify-center px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-sm hover:bg-yellow-100 transition-colors"
            title="Editar aluno"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  student: {
    type: Object,
    required: true,
    validator: (value) => {
      return value.id && value.name
    }
  }
})

const emit = defineEmits(['edit', 'attendance', 'grades'])

const router = useRouter()

// Iniciais do aluno para o placeholder
const studentInitials = computed(() => {
  const names = props.student.name.split(' ')
  const first = names[0] ? names[0][0] : ''
  const last = names.length > 1 ? names[names.length - 1][0] : ''
  return `${first}${last}`.toUpperCase()
})

// Formata a data de nascimento
const formattedBirthDate = computed(() => {
  if (!props.student.birthDate) return '--'
  
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' }
  return new Date(props.student.birthDate).toLocaleDateString('pt-BR', options)
})

// Ações
const openEdit = () => {
  emit('edit', props.student)
}

const openAttendance = () => {
  emit('attendance', props.student)
  // Ou navegar diretamente:
  // router.push(`/attendance?studentId=${props.student.id}`)
}

const openGrades = () => {
  emit('grades', props.student)
  // Ou navegar diretamente:
  // router.push(`/grades?studentId=${props.student.id}`)
}
</script>

<style scoped>
/* Estilos personalizados podem ser adicionados aqui */
</style>