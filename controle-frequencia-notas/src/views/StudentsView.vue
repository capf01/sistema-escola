<template>
  <div class="min-h-full">
    <NavBar />
    
    <div class="flex">
      <SideBar />
      
      <main class="flex-1 pb-8">
        <!-- Cabeçalho -->
        <div class="bg-white shadow">
          <div class="px-4 sm:px-6 lg:max-w-7xl lg:mx-auto lg:px-8 py-6">
            <div class="flex justify-between items-center">
              <div>
                <h1 class="text-2xl font-bold text-gray-900">Gerenciamento de Alunos</h1>
                <p class="mt-1 text-sm text-gray-500">
                  Cadastre, edite e visualize os alunos do sistema
                </p>
              </div>
              <button
                @click="openAddStudentModal"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Novo Aluno
              </button>
            </div>
          </div>
        </div>

        <!-- Conteúdo principal -->
        <div class="mt-8 px-4 sm:px-6 lg:max-w-7xl lg:mx-auto lg:px-8">
          <!-- Filtros e busca -->
          <div class="mb-6 bg-white p-4 rounded-lg shadow">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Buscar por nome</label>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Digite o nome do aluno"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Turma</label>
                <select
                  v-model="selectedClass"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Todas as turmas</option>
                  <option v-for="classOption in classOptions" :key="classOption" :value="classOption">
                    {{ classOption }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  v-model="selectedStatus"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Todos</option>
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Tabela de alunos -->
          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div v-if="studentsStore.loading" class="p-8 text-center">
              <div class="flex justify-center">
                <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p class="mt-2 text-sm text-gray-500">Carregando alunos...</p>
            </div>

            <div v-else-if="studentsStore.error" class="p-8 text-center text-red-500">
              <p>Erro ao carregar alunos: {{ studentsStore.error }}</p>
              <button
                @click="studentsStore.loadStudents()"
                class="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Tentar novamente
              </button>
            </div>

            <div v-else>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nome
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Matrícula
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Turma
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nascimento
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="student in filteredStudents" :key="student.id" class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="flex-shrink-0 h-10 w-10">
                            <div class="h-full w-full rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          </div>
                          <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">{{ student.name }}</div>
                            <div class="text-sm text-gray-500">{{ student.email || 'N/A' }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ student.registrationNumber }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {{ student.class }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ formatDate(student.birthDate) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span v-if="student.active" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Ativo
                        </span>
                        <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Inativo
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          @click="openEditStudentModal(student)"
                          class="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Editar
                        </button>
                        <button
                          @click="openStudentDetails(student)"
                          class="text-green-600 hover:text-green-900 mr-3"
                        >
                          Detalhes
                        </button>
                        <button
                          @click="confirmDeleteStudent(student)"
                          class="text-red-600 hover:text-red-900"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Paginação -->
              <div v-if="filteredStudents.length > 0" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p class="text-sm text-gray-700">
                      Mostrando
                      <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
                      a
                      <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredStudents.length) }}</span>
                      de
                      <span class="font-medium">{{ filteredStudents.length }}</span>
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

              <!-- Sem resultados -->
              <div v-if="filteredStudents.length === 0 && !studentsStore.loading" class="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum aluno encontrado</h3>
                <p class="mt-1 text-sm text-gray-500">
                  Tente ajustar seus filtros de busca ou cadastre um novo aluno.
                </p>
                <div class="mt-6">
                  <button
                    @click="resetFilters"
                    type="button"
                    class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Limpar filtros
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Modal de cadastro/edição -->
    <StudentFormModal
      :show="showStudentModal"
      :student="currentStudent"
      :loading="formLoading"
      @close="closeStudentModal"
      @save="handleSaveStudent"
    />

    <!-- Modal de confirmação de exclusão -->
    <ConfirmationModal
      :show="showDeleteModal"
      title="Confirmar exclusão"
      message="Tem certeza que deseja excluir este aluno? Esta ação não pode ser desfeita."
      confirm-text="Excluir"
      cancel-text="Cancelar"
      variant="danger"
      @confirm="deleteStudent"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStudentsStore } from '@/stores/students'
import NavBar from '@/components/ui/NavBar.vue'
import SideBar from '@/components/ui/SideBar.vue'
import StudentFormModal from '@/components/students/StudentFormModal.vue'
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue'

const studentsStore = useStudentsStore()

// Filtros e busca
const searchQuery = ref('')
const selectedClass = ref('')
const selectedStatus = ref('')

// Paginação
const currentPage = ref(1)
const itemsPerPage = 10

// Modal states
const showStudentModal = ref(false)
const showDeleteModal = ref(false)
const formLoading = ref(false)
const currentStudent = ref(null)
const studentToDelete = ref(null)

// Carrega dados iniciais
onMounted(() => {
  studentsStore.loadStudents()
})

// Opções de turma para filtro
const classOptions = computed(() => {
  const classes = new Set()
  studentsStore.students.forEach(student => classes.add(student.class))
  return Array.from(classes).sort()
})

// Alunos filtrados
const filteredStudents = computed(() => {
  let result = studentsStore.students

  // Aplica filtro de busca
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(student => 
      student.name.toLowerCase().includes(query) ||
      student.registrationNumber.toLowerCase().includes(query)
    )
  }

  // Aplica filtro de turma
  if (selectedClass.value) {
    result = result.filter(student => student.class === selectedClass.value)
  }

  // Aplica filtro de status
  if (selectedStatus.value) {
    const isActive = selectedStatus.value === 'active'
    result = result.filter(student => student.active === isActive)
  }

  return result
})

// Paginação
const totalPages = computed(() => Math.ceil(filteredStudents.value.length / itemsPerPage))
const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredStudents.value.slice(start, end)
})

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// Formatação de dados
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR')
}

// Manipulação de modais
const openAddStudentModal = () => {
  currentStudent.value = null
  showStudentModal.value = true
}

const openEditStudentModal = (student) => {
  currentStudent.value = { ...student }
  showStudentModal.value = true
}

const openStudentDetails = (student) => {
  // Navegar para a página de detalhes do aluno
  console.log('Abrir detalhes do aluno:', student)
}

const closeStudentModal = () => {
  showStudentModal.value = false
}

const confirmDeleteStudent = (student) => {
  studentToDelete.value = student.id
  showDeleteModal.value = true
}

// Manipulação de dados
const handleSaveStudent = async (studentData) => {
  formLoading.value = true
  try {
    if (currentStudent.value) {
      await studentsStore.updateStudent(currentStudent.value.id, studentData)
    } else {
      await studentsStore.addStudent(studentData)
    }
    showStudentModal.value = false
  } catch (error) {
    console.error('Erro ao salvar aluno:', error)
  } finally {
    formLoading.value = false
  }
}

const deleteStudent = async () => {
  try {
    await studentsStore.deleteStudent(studentToDelete.value)
    showDeleteModal.value = false
  } catch (error) {
    console.error('Erro ao excluir aluno:', error)
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedClass.value = ''
  selectedStatus.value = ''
  currentPage.value = 1
}
</script>

<style scoped>
/* Estilos personalizados podem ser adicionados aqui */
</style>