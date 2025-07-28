<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <!-- Cabeçalho com título e ações -->
    <div class="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div class="mb-4 sm:mb-0">
        <h2 class="text-xl font-semibold text-gray-800">Relatório de Frequência</h2>
        <p class="text-sm text-gray-500">Registros de presença e ausência dos alunos</p>
      </div>
      
      <div class="flex items-center space-x-3">
        <!-- Filtro por período -->
        <div class="relative">
          <label class="sr-only">Período</label>
          <select 
            v-model="selectedPeriod"
            class="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="today">Hoje</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mês</option>
            <option value="custom">Personalizado</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>

        <!-- Filtro por turma -->
        <div class="relative">
          <label class="sr-only">Turma</label>
          <select 
            v-model="selectedClass"
            class="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todas as turmas</option>
            <option v-for="classOption in classOptions" :key="classOption" :value="classOption">
              {{ classOption }}
            </option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>

        <!-- Botão Exportar -->
        <button
          @click="exportToPDF"
          class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="-ml-0.5 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Exportar
        </button>
      </div>
    </div>

    <!-- Filtros personalizados -->
    <div v-if="selectedPeriod === 'custom'" class="px-6 py-4 border-b border-gray-200 bg-gray-50">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Data inicial</label>
          <input
            v-model="startDate"
            type="date"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Data final</label>
          <input
            v-model="endDate"
            type="date"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="p-8 flex justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- Mensagem quando não há dados -->
    <div v-else-if="filteredAttendance.length === 0" class="p-8 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum registro encontrado</h3>
      <p class="mt-1 text-sm text-gray-500">Tente ajustar os filtros selecionados.</p>
    </div>

    <!-- Tabela de resultados -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aluno
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Turma
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Observações
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="record in paginatedAttendance" :key="record.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <span class="text-blue-600 font-medium">
                    {{ getInitials(record.studentName) }}
                  </span>
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ record.studentName }}</div>
                  <div class="text-sm text-gray-500">{{ record.studentId }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                {{ record.class }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(record.date) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                :class="record.present ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
              >
                {{ record.present ? 'Presente' : 'Ausente' }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
              {{ record.notes || '--' }}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Paginação -->
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Mostrando
              <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
              a
              <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredAttendance.length) }}</span>
              de
              <span class="font-medium">{{ filteredAttendance.length }}</span>
              resultados
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">Anterior</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
              <button
                v-for="page in totalPages"
                :key="page"
                @click="currentPage = page"
                :class="[page === currentPage ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50', 'relative inline-flex items-center px-4 py-2 border text-sm font-medium']"
              >
                {{ page }}
              </button>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">Próximo</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useAttendance } from '@/composables/useAttendance'
import { useStudents } from '@/composables/useStudents'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const { 
  attendanceRecords, 
  todayAttendance, 
  loadAttendanceRecords, 
  loadTodayAttendance,
  getClassAttendance,
  calculateAttendanceStats
} = useAttendance()

const { students, loadStudents } = useStudents()

// Filtros
const selectedPeriod = ref('today')
const selectedClass = ref('')
const startDate = ref('')
const endDate = ref('')

// Paginação
const currentPage = ref(1)
const itemsPerPage = 10

// Estados
const isLoading = ref(false)

// Carrega dados iniciais
onMounted(async () => {
  isLoading.value = true
  try {
    await Promise.all([loadStudents(), loadTodayAttendance()])
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
  } finally {
    isLoading.value = false
  }
})

// Opções de turma
const classOptions = computed(() => {
  const classes = new Set()
  students.value.forEach(student => classes.add(student.class))
  return Array.from(classes).sort()
})

// Filtra os registros de acordo com os filtros selecionados
const filteredAttendance = computed(() => {
  let records = selectedPeriod.value === 'today' 
    ? todayAttendance.value 
    : attendanceRecords.value

  // Filtro por turma
  if (selectedClass.value) {
    records = records.filter(record => record.class === selectedClass.value)
  }

  // Filtro por período personalizado
  if (selectedPeriod.value === 'custom' && startDate.value && endDate.value) {
    const start = new Date(startDate.value)
    const end = new Date(endDate.value)
    
    records = records.filter(record => {
      const recordDate = new Date(record.date)
      return recordDate >= start && recordDate <= end
    })
  }

  // Filtro por semana
  if (selectedPeriod.value === 'week') {
    const today = new Date()
    const firstDay = new Date(today.setDate(today.getDate() - today.getDay()))
    const lastDay = new Date(today.setDate(today.getDate() + 6))
    
    records = records.filter(record => {
      const recordDate = new Date(record.date)
      return recordDate >= firstDay && recordDate <= lastDay
    })
  }

  // Filtro por mês
  if (selectedPeriod.value === 'month') {
    const today = new Date()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    
    records = records.filter(record => {
      const recordDate = new Date(record.date)
      return recordDate >= firstDay && recordDate <= lastDay
    })
  }

  return records.sort((a, b) => new Date(b.date) - new Date(a.date))
})

// Dados paginados
const paginatedAttendance = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredAttendance.value.slice(start, end)
})

// Total de páginas
const totalPages = computed(() => {
  return Math.ceil(filteredAttendance.value.length / itemsPerPage)
})

// Navegação entre páginas
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// Observa mudanças nos filtros
watch([selectedPeriod, selectedClass, startDate, endDate], async () => {
  currentPage.value = 1
  
  if (selectedPeriod.value !== 'today') {
    isLoading.value = true
    try {
      await loadAttendanceRecords()
    } catch (error) {
      console.error('Erro ao carregar registros:', error)
    } finally {
      isLoading.value = false
    }
  }
})

// Formatação de dados
const formatDate = (dateString) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' }
  return new Date(dateString).toLocaleDateString('pt-BR', options)
}

const getInitials = (name) => {
  const names = name.split(' ')
  const first = names[0] ? names[0][0] : ''
  const last = names.length > 1 ? names[names.length - 1][0] : ''
  return `${first}${last}`.toUpperCase()
}

// Exportação para PDF
const exportToPDF = () => {
  const doc = new jsPDF()
  
  // Título
  doc.setFontSize(18)
  doc.text('Relatório de Frequência', 14, 20)
  
  // Período
  doc.setFontSize(12)
  let periodText = ''
  
  switch (selectedPeriod.value) {
    case 'today':
      periodText = `Data: ${formatDate(new Date())}`
      break
    case 'week':
      periodText = 'Período: Esta semana'
      break
    case 'month':
      periodText = 'Período: Este mês'
      break
    case 'custom':
      periodText = `Período: ${formatDate(startDate.value)} - ${formatDate(endDate.value)}`
      break
  }
  
  doc.text(periodText, 14, 30)
  
  // Filtro de turma
  if (selectedClass.value) {
    doc.text(`Turma: ${selectedClass.value}`, 14, 40)
  }
  
  // Estatísticas
  const stats = calculateAttendanceStats(filteredAttendance.value)
  doc.text(`Total de registros: ${stats.total}`, 14, 50)
  doc.text(`Presenças: ${stats.present} (${stats.attendanceRate}%)`, 14, 60)
  doc.text(`Ausências: ${stats.absent}`, 14, 70)
  
  // Tabela
  const headers = [['Aluno', 'Turma', 'Data', 'Status', 'Observações']]
  const data = filteredAttendance.value.map(record => [
    record.studentName,
    record.class,
    formatDate(record.date),
    record.present ? 'Presente' : 'Ausente',
    record.notes || '--'
  ])
  
  doc.autoTable({
    startY: 80,
    head: headers,
    body: data,
    margin: { left: 14 },
    styles: { fontSize: 9 },
    headStyles: { fillColor: [41, 128, 185] }
  })
  
  doc.save(`relatorio_frequencia_${new Date().toISOString().slice(0, 10)}.pdf`)
}
</script>

<style scoped>
/* Estilos personalizados podem ser adicionados aqui */
</style>