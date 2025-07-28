<template>
  <div class="min-h-full bg-gray-50">
    <NavBar />
    
    <div class="flex">
      <SideBar />
      
      <main class="flex-1 pb-8">
        <!-- Cabeçalho -->
        <div class="bg-white shadow-sm">
          <div class="px-4 sm:px-6 lg:max-w-7xl lg:mx-auto lg:px-8 py-6">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 class="text-2xl font-bold text-gray-900">Relatórios</h1>
                <p class="mt-1 text-sm text-gray-600">
                  Gerencie e exporte relatórios de frequência e notas
                </p>
              </div>
              <div class="flex space-x-3 w-full sm:w-auto">
                <button
                  @click="exportAllToPDF"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Exportar Tudo
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Conteúdo principal -->
        <div class="mt-8 px-4 sm:px-6 lg:max-w-7xl lg:mx-auto lg:px-8">
          <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <!-- Filtros -->
            <div class="lg:col-span-1">
              <div class="bg-white shadow overflow-hidden sm:rounded-xl">
                <div class="px-5 py-4 border-b border-gray-200 bg-gray-50">
                  <h3 class="text-lg leading-6 font-medium text-gray-800">Filtros</h3>
                </div>
                <div class="px-5 py-6 sm:p-6">
                  <div class="space-y-5">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Período</label>
                      <div class="grid grid-cols-2 gap-3">
                        <div class="space-y-1">
                          <label class="text-xs text-gray-500">Início</label>
                          <input
                            v-model="filters.startDate"
                            type="date"
                            class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border text-sm transition duration-200"
                          />
                        </div>
                        <div class="space-y-1">
                          <label class="text-xs text-gray-500">Fim</label>
                          <input
                            v-model="filters.endDate"
                            type="date"
                            class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border text-sm transition duration-200"
                          />
                        </div>
                      </div>
                    </div>

                    <div class="space-y-1">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Turma</label>
                      <select
                        v-model="filters.class"
                        class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border text-sm transition duration-200"
                      >
                        <option value="">Todas as turmas</option>
                        <option v-for="classOption in classOptions" :key="classOption" :value="classOption">
                          {{ classOption }}
                        </option>
                      </select>
                    </div>

                    <div class="space-y-1">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Disciplina</label>
                      <select
                        v-model="filters.subject"
                        class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border text-sm transition duration-200"
                      >
                        <option value="">Todas as disciplinas</option>
                        <option v-for="subject in subjectOptions" :key="subject" :value="subject">
                          {{ subject }}
                        </option>
                      </select>
                    </div>

                    <div class="space-y-1">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Relatório</label>
                      <select
                        v-model="activeReport"
                        class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border text-sm transition duration-200"
                      >
                        <option value="attendance">Frequência</option>
                        <option value="grades">Notas</option>
                        <option value="combined">Completo</option>
                      </select>
                    </div>

                    <button
                      @click="applyFilters"
                      class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                    >
                      Aplicar Filtros
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Relatórios -->
            <div class="lg:col-span-2 space-y-6">
              <!-- Relatório de Frequência -->
              <div v-if="activeReport === 'attendance' || activeReport === 'combined'" class="bg-white shadow overflow-hidden sm:rounded-xl">
                <div class="px-5 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                  <h3 class="text-lg leading-6 font-medium text-gray-800">Relatório de Frequência</h3>
                  <button
                    @click="exportAttendanceToPDF"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Exportar
                  </button>
                </div>
                <div class="px-5 py-6 sm:p-6">
                  <AttendanceReport :filters="filters" />
                </div>
              </div>

              <!-- Relatório de Notas -->
              <div v-if="activeReport === 'grades' || activeReport === 'combined'" class="bg-white shadow overflow-hidden sm:rounded-xl">
                <div class="px-5 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                  <h3 class="text-lg leading-6 font-medium text-gray-800">Relatório de Notas</h3>
                  <button
                    @click="exportGradesToPDF"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Exportar
                  </button>
                </div>
                <div class="px-5 py-6 sm:p-6">
                  <GradesReport :filters="filters" />
                </div>
              </div>

              <!-- Dados vazios -->
              <div v-if="!filteredData.length" class="bg-white shadow overflow-hidden sm:rounded-xl">
                <div class="px-5 py-12 text-center">
                  <div class="mx-auto h-24 w-24 text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 class="mt-3 text-lg font-medium text-gray-700">Nenhum dado encontrado</h3>
                  <p class="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                    Ajuste os filtros ou verifique se existem dados para o período selecionado.
                  </p>
                  <button
                    @click="resetFilters"
                    class="mt-4 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                  >
                    Redefinir filtros
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStudentsStore } from '@/stores/students'
import { useAttendanceStore } from '@/stores/attendance'
import { useGradesStore } from '@/stores/grades'
import NavBar from '@/components/ui/NavBar.vue'
import SideBar from '@/components/ui/SideBar.vue'
import AttendanceReport from '@/components/reports/AttendanceReport.vue'
import GradesReport from '@/components/reports/GradesReport.vue'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const studentsStore = useStudentsStore()
const attendanceStore = useAttendanceStore()
const gradesStore = useGradesStore()

const activeReport = ref('combined')
const filters = ref({
  startDate: '',
  endDate: '',
  class: '',
  subject: ''
})

// Carrega dados iniciais
onMounted(() => {
  studentsStore.loadStudents()
  attendanceStore.loadAttendance()
  gradesStore.loadGrades()
  
  // Define datas padrão (últimos 30 dias)
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(endDate.getDate() - 30)
  
  filters.value.startDate = startDate.toISOString().split('T')[0]
  filters.value.endDate = endDate.toISOString().split('T')[0]
})

// Opções para filtros
const classOptions = computed(() => {
  const classes = new Set()
  studentsStore.students.forEach(student => classes.add(student.class))
  return Array.from(classes).sort()
})

const subjectOptions = computed(() => {
  const subjects = new Set()
  gradesStore.grades.forEach(grade => subjects.add(grade.subject))
  return Array.from(subjects).sort()
})

// Aplica filtros
const applyFilters = () => {
  // Implementar lógica de filtragem se necessário
  console.log('Filtros aplicados:', filters.value)
}

// Reseta filtros
const resetFilters = () => {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(endDate.getDate() - 30)
  
  filters.value = {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    class: '',
    subject: ''
  }
}

// Dados filtrados (exemplo)
const filteredData = computed(() => {
  // Implementar lógica real de filtragem baseada nos filtros
  return studentsStore.students // Placeholder
})

// Exportar para PDF
const exportAttendanceToPDF = () => {
  const doc = new jsPDF()
  doc.text('Relatório de Frequência', 14, 20)
  // Adicionar tabela com dados de frequência
  doc.save('relatorio_frequencia.pdf')
}

const exportGradesToPDF = () => {
  const doc = new jsPDF()
  doc.text('Relatório de Notas', 14, 20)
  // Adicionar tabela com dados de notas
  doc.save('relatorio_notas.pdf')
}

const exportAllToPDF = () => {
  const doc = new jsPDF()
  
  // Página 1 - Frequência
  doc.text('Relatório de Frequência', 14, 20)
  // Adicionar tabela de frequência
  doc.addPage()
  
  // Página 2 - Notas
  doc.text('Relatório de Notas', 14, 20)
  // Adicionar tabela de notas
  
  doc.save('relatorio_completo.pdf')
}
</script>

<style scoped>
/* Estilos para os selects com seta personalizada */
select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1.25em 1.25em;
  padding-right: 2.5rem;
}

/* Transições suaves */
button, input, select {
  transition: all 0.2s ease;
}

/* Efeito de hover nos cards de relatório */
[class*="bg-white"]:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}

/* Melhor visualização para data inputs */
input[type="date"]::-webkit-calendar-picker-indicator {
  opacity: 0.6;
  cursor: pointer;
}

input[type="date"]:hover::-webkit-calendar-picker-indicator {
  opacity: 1;
}
</style>