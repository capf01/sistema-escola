<template>
  <div class="bg-white shadow-lg rounded-xl p-6 max-w-3xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">
        {{ editing ? 'Editar Nota' : 'Lançar Nova Nota' }}
      </h2>
      <button 
        @click="$emit('close')"
        class="text-gray-500 hover:text-gray-700 transition-colors duration-200"
        aria-label="Fechar modal"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div v-if="error" class="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
      {{ error }}
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Seleção de Aluno -->
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700">Aluno</label>
          <select
            v-model="form.studentId"
            required
            :disabled="editing"
            class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-200 py-2 px-3 border"
            @change="updateStudentInfo"
          >
            <option value="" disabled selected>Selecione um aluno</option>
            <option 
              v-for="student in filteredStudents" 
              :key="student.id" 
              :value="student.id"
            >
              {{ student.name }} ({{ student.registrationNumber }})
            </option>
          </select>
        </div>

        <!-- Turma (auto-preenchido) -->
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700">Turma</label>
          <input
            v-model="form.class"
            type="text"
            readonly
            class="w-full rounded-lg border-gray-300 shadow-sm bg-gray-50 focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border cursor-not-allowed"
          >
        </div>

        <!-- Disciplina -->
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700">Disciplina</label>
          <select
            v-model="form.subject"
            required
            class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-200 py-2 px-3 border"
          >
            <option value="" disabled selected>Selecione a disciplina</option>
            <option v-for="subject in subjectOptions" :key="subject" :value="subject">
              {{ subject }}
            </option>
          </select>
        </div>

        <!-- Período -->
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700">Período</label>
          <select
            v-model="form.period"
            required
            class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-200 py-2 px-3 border"
          >
            <option value="" disabled selected>Selecione o período</option>
            <option v-for="n in 4" :key="n" :value="n">{{ n }}º Bimestre</option>
          </select>
        </div>

        <!-- Valor da Nota -->
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700">
            Nota (0-10)
            <span v-if="form.value" class="text-xs font-normal ml-1">
              ({{ gradeDescription }})
            </span>
          </label>
          <input
            v-model="form.value"
            type="number"
            min="0"
            max="10"
            step="0.1"
            required
            class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-200 py-2 px-3 border"
          >
        </div>

        <!-- Data de Lançamento -->
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700">Data</label>
          <input
            v-model="form.date"
            type="date"
            required
            class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-200 py-2 px-3 border"
          >
        </div>
      </div>

      <!-- Observações -->
      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-700">Observações</label>
        <textarea
          v-model="form.notes"
          rows="3"
          class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-200 py-2 px-3 border"
          placeholder="Informações adicionais sobre a avaliação"
        ></textarea>
      </div>

      <!-- Ações -->
      <div class="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
        >
          Cancelar
        </button>
        <button
          type="submit"
          :disabled="isProcessing"
          :class="[
            isProcessing
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700',
            'px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 flex items-center'
          ]"
        >
          <span v-if="!isProcessing">
            {{ editing ? 'Atualizar Nota' : 'Lançar Nota' }}
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
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useGrades } from '@/composables/useGrades'
import { useStudents } from '@/composables/useStudents'

const props = defineProps({
  editing: {
    type: Boolean,
    default: false
  },
  gradeData: {
    type: Object,
    default: null
  },
  studentId: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

// Composables
const { 
  addGrade, 
  updateGrade, 
  isLoading: gradesLoading, 
  error: gradesError,
  getAvailableSubjects
} = useGrades()

const { 
  students, 
  isLoading: studentsLoading, 
  loadStudents,
  filteredStudents
} = useStudents()

// Estado do formulário
const form = ref({
  studentId: '',
  studentName: '',
  class: '',
  subject: '',
  period: 1,
  value: null,
  date: new Date().toISOString().split('T')[0],
  notes: ''
})

// Estados da UI
const isProcessing = ref(false)
const error = ref('')
const subjectOptions = ref([])

// Descrição da nota
const gradeDescription = computed(() => {
  if (!form.value.value) return ''
  const grade = parseFloat(form.value.value)
  
  if (grade >= 9) return 'Excelente'
  if (grade >= 7) return 'Bom'
  if (grade >= 5) return 'Regular'
  return 'Precisa melhorar'
})

// Carrega dados iniciais
onMounted(async () => {
  await loadStudents()
  subjectOptions.value = await getAvailableSubjects()
  
  // Se for edição, preenche o formulário com os dados existentes
  if (props.editing && props.gradeData) {
    form.value = { ...props.gradeData }
  }
  
  // Se veio com studentId pré-selecionado
  if (props.studentId) {
    form.value.studentId = props.studentId
    updateStudentInfo()
  }
})

// Atualiza informações do aluno selecionado
const updateStudentInfo = () => {
  const selectedStudent = students.value.find(s => s.id === form.value.studentId)
  if (selectedStudent) {
    form.value.studentName = selectedStudent.name
    form.value.class = selectedStudent.class
  }
}

// Validação do formulário
const validateForm = () => {
  if (!form.value.studentId) {
    return { isValid: false, error: 'Selecione um aluno' }
  }
  
  if (!form.value.subject) {
    return { isValid: false, error: 'Selecione uma disciplina' }
  }
  
  if (form.value.value === null || form.value.value === '') {
    return { isValid: false, error: 'Informe o valor da nota' }
  }
  
  const grade = parseFloat(form.value.value)
  if (isNaN(grade) || grade < 0 || grade > 10) {
    return { isValid: false, error: 'A nota deve estar entre 0 e 10' }
  }
  
  return { isValid: true }
}

// Manipulador do formulário
const handleSubmit = async () => {
  const validation = validateForm()
  if (!validation.isValid) {
    error.value = validation.error
    return
  }

  isProcessing.value = true
  error.value = ''

  try {
    const gradeData = {
      ...form.value,
      value: parseFloat(form.value.value),
      period: parseInt(form.value.period)
    }

    const result = props.editing
      ? await updateGrade(props.gradeData.id, gradeData)
      : await addGrade(gradeData)

    if (result.success) {
      emit('saved')
      resetForm()
      emit('close')
    } else {
      error.value = result.error || 'Ocorreu um erro ao processar a nota'
    }
  } catch (err) {
    error.value = err.message || 'Erro ao processar a requisição'
    console.error(err)
  } finally {
    isProcessing.value = false
  }
}

// Reseta o formulário
const resetForm = () => {
  form.value = {
    studentId: '',
    studentName: '',
    class: '',
    subject: '',
    period: 1,
    value: null,
    date: new Date().toISOString().split('T')[0],
    notes: ''
  }
}

// Observa mudanças no loading/error dos composables
watch([gradesLoading, gradesError], ([loading, gradeError]) => {
  if (gradeError) {
    error.value = gradeError
  }
})
</script>

<style scoped>
/* Transições suaves para elementos interativos */
select, input, textarea, button {
  transition: all 0.2s ease;
}

/* Melhor aparência para o textarea */
textarea {
  min-height: 80px;
  resize: vertical;
}

/* Estilo para o select com seta personalizada */
select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

/* Efeito de hover mais suave para botões */
button:not(:disabled):hover {
  transform: translateY(-1px);
}

/* Foco mais visível para acessibilidade */
select:focus, input:focus, textarea:focus, button:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
}
</style>