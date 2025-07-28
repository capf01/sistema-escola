<template>
  <div class="bg-white shadow rounded-lg p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold text-gray-800">
        {{ editing ? 'Editar Registro de Frequência' : 'Novo Registro de Frequência' }}
      </h2>
      <button 
        @click="$emit('close')"
        class="text-gray-500 hover:text-gray-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div v-if="error" class="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
      {{ error }}
    </div>

    <form @submit.prevent="handleSubmit">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Data</label>
          <input
            v-model="date"
            type="date"
            required
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Turma</label>
          <select
            v-model="selectedClass"
            required
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            @change="loadStudents"
          >
            <option value="" disabled>Selecione uma turma</option>
            <option v-for="classOption in classOptions" :key="classOption" :value="classOption">
              {{ classOption }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="isLoading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>

      <div v-else>
        <div v-if="studentsByClass.length > 0" class="mb-6">
          <h3 class="text-sm font-medium text-gray-700 mb-3">Lista de Alunos</h3>
          
          <div class="space-y-2">
            <div 
              v-for="student in studentsByClass" 
              :key="student.id"
              class="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50"
            >
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <span class="text-blue-600 font-medium">
                    {{ student.name.charAt(0) }}
                  </span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ student.name }}</p>
                  <p class="text-xs text-gray-500">Matrícula: {{ student.registrationNumber }}</p>
                </div>
              </div>
              
              <button
                type="button"
                @click="toggleStudentPresence(student.id)"
                :class="[
                  isStudentPresent(student.id) 
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-red-100 text-red-800 hover:bg-red-200',
                  'px-3 py-1 rounded-full text-xs font-medium'
                ]"
              >
                {{ isStudentPresent(student.id) ? 'Presente' : 'Ausente' }}
              </button>
            </div>
          </div>
        </div>

        <div v-else class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-yellow-700">
                Nenhum aluno encontrado nesta turma.
              </p>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">Observações</label>
          <textarea
            v-model="notes"
            rows="3"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Informações adicionais sobre a aula"
          ></textarea>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="isProcessing || studentsByClass.length === 0"
            :class="[
              isProcessing || studentsByClass.length === 0
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700',
              'px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            ]"
          >
            <span v-if="!isProcessing">
              {{ editing ? 'Atualizar' : 'Registrar' }}
            </span>
            <span v-else class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processando...
            </span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useAttendance } from '@/composables/useAttendance'
import { useStudents } from '@/composables/useStudents'

const props = defineProps({
  editing: {
    type: Boolean,
    default: false
  },
  attendanceRecord: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

// Composables
const {
  date,
  selectedClass,
  presentStudents,
  notes,
  isProcessing,
  error,
  classOptions,
  studentsByClass,
  recordClassAttendance,
  updateAttendanceRecord,
  toggleStudentPresence,
  isStudentPresent,
  resetForm
} = useAttendance()

const { loadStudents } = useStudents()

// Carrega dados iniciais se for edição
onMounted(() => {
  if (props.editing && props.attendanceRecord) {
    date.value = props.attendanceRecord.date
    selectedClass.value = props.attendanceRecord.class
    notes.value = props.attendanceRecord.notes
    
    // Marcar alunos presentes (depende da implementação do seu modelo de dados)
    if (props.attendanceRecord.presentStudents) {
      presentStudents.value = [...props.attendanceRecord.presentStudents]
    }
  }
})

// Carrega alunos quando a turma é selecionada
const loadStudentsForAttendance = async () => {
  if (selectedClass.value) {
    await loadStudents()
  }
}

// Manipulador do formulário
const handleSubmit = async () => {
  const result = props.editing
    ? await updateAttendanceRecord(props.attendanceRecord.id, {
        date: date.value,
        class: selectedClass.value,
        presentStudents: presentStudents.value,
        notes: notes.value
      })
    : await recordClassAttendance()

  if (result.success) {
    emit('saved')
    resetForm()
    emit('close')
  }
}

// Observa mudanças na turma selecionada
watch(selectedClass, (newClass) => {
  if (newClass) {
    loadStudentsForAttendance()
  }
})
</script>

<style scoped>
/* Estilos personalizados podem ser adicionados aqui */
</style>