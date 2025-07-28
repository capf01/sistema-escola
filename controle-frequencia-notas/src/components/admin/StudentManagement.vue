<template>
  <div class="student-management-container">
    <div class="header">
      <h2 class="title">Gerenciamento de Alunos</h2>
      <div class="header-actions">
        <button @click="openCreateModal" class="add-button">
          <i class="fas fa-plus"></i> Adicionar Aluno
        </button>
        <button @click="exportToExcel" class="export-button">
          <i class="fas fa-file-excel"></i> Exportar
        </button>
      </div>
    </div>

    <div class="filters">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Pesquisar alunos..."
        class="search-input"
      />
      <select v-model="classFilter" class="class-select">
        <option value="">Todas as turmas</option>
        <option v-for="classItem in classes" :key="classItem" :value="classItem">
          {{ classItem }}
        </option>
      </select>
      <select v-model="statusFilter" class="status-select">
        <option value="">Todos os status</option>
        <option value="active">Ativos</option>
        <option value="inactive">Inativos</option>
      </select>
    </div>

    <div class="student-table-container">
      <table class="student-table">
        <thead>
          <tr>
            <th @click="sortBy('name')" class="sortable">
              Nome
              <i :class="sortIcon('name')"></i>
            </th>
            <th @click="sortBy('registration')" class="sortable">
              Matrícula
              <i :class="sortIcon('registration')"></i>
            </th>
            <th>Turma</th>
            <th>Responsável</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in filteredStudents" :key="student.id">
            <td>{{ student.name }}</td>
            <td>{{ student.registration }}</td>
            <td>
              <span class="class-badge">
                {{ student.class }}
              </span>
            </td>
            <td>{{ student.guardian }}</td>
            <td>
              <span :class="`status-badge ${student.active ? 'active' : 'inactive'}`">
                {{ student.active ? 'Ativo' : 'Inativo' }}
              </span>
            </td>
            <td class="actions">
              <button @click="editStudent(student)" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <button @click="viewDetails(student)" class="view-btn">
                <i class="fas fa-eye"></i>
              </button>
              <button 
                @click="toggleStatus(student)" 
                :class="`status-btn ${student.active ? 'deactivate' : 'activate'}`"
              >
                <i :class="`fas ${student.active ? 'fa-user-slash' : 'fa-user-check'}`"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination" v-if="filteredStudents.length > 0">
      <button @click="prevPage" :disabled="currentPage === 1" class="page-button">
        <i class="fas fa-chevron-left"></i>
      </button>
      <span class="page-info">Página {{ currentPage }} de {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="page-button">
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>

    <div v-if="filteredStudents.length === 0" class="empty-state">
      <i class="fas fa-user-graduate empty-icon"></i>
      <p>Nenhum aluno encontrado</p>
    </div>

    <!-- Modal de criação/edição -->
    <StudentModal
      v-if="showModal"
      :student="selectedStudent"
      :mode="modalMode"
      :classes="classes"
      @close="closeModal"
      @save="handleSave"
    />

    <!-- Modal de detalhes -->
    <StudentDetailsModal
      v-if="showDetailsModal"
      :student="selectedStudent"
      @close="closeDetailsModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import StudentModal from './StudentModal.vue'
import StudentDetailsModal from './StudentDetailsModal.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Dados
const students = ref([])
const searchQuery = ref('')
const classFilter = ref('')
const statusFilter = ref('')
const classes = ref(['1º A', '1º B', '2º A', '2º B', '3º A', '3º B'])
const sortField = ref('name')
const sortDirection = ref('asc')
const showModal = ref(false)
const showDetailsModal = ref(false)
const selectedStudent = ref(null)
const modalMode = ref('create') // 'create' or 'edit'
const currentPage = ref(1)
const itemsPerPage = 10

// Buscar alunos (simulando API)
const fetchStudents = async () => {
  try {
    // Substituir por chamada real à API
    const response = await fetchStudentsFromAPI()
    students.value = response
  } catch (error) {
    console.error('Erro ao buscar alunos:', error)
  }
}

// Filtros e ordenação
const filteredStudents = computed(() => {
  let result = students.value
  
  // Filtro por texto
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(student => 
      student.name.toLowerCase().includes(query) || 
      student.registration.toLowerCase().includes(query) ||
      student.guardian.toLowerCase().includes(query)
    )
  }
  
  // Filtro por turma
  if (classFilter.value) {
    result = result.filter(student => student.class === classFilter.value)
  }
  
  // Filtro por status
  if (statusFilter.value) {
    result = result.filter(student => 
      statusFilter.value === 'active' ? student.active : !student.active
    )
  }
  
  // Ordenação
  const sorted = [...result].sort((a, b) => {
    const fieldA = a[sortField.value]
    const fieldB = b[sortField.value]
    
    if (fieldA < fieldB) return sortDirection.value === 'asc' ? -1 : 1
    if (fieldA > fieldB) return sortDirection.value === 'asc' ? 1 : -1
    return 0
  })

  // Paginação
  const start = (currentPage.value - 1) * itemsPerPage
  return sorted.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => {
  return Math.ceil(students.value.length / itemsPerPage)
})

// Funções auxiliares
const sortBy = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const sortIcon = (field) => {
  if (sortField.value !== field) return 'fas fa-sort'
  return sortDirection.value === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'
}

// Paginação
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Modal functions
const openCreateModal = () => {
  selectedStudent.value = null
  modalMode.value = 'create'
  showModal.value = true
}

const editStudent = (student) => {
  selectedStudent.value = { ...student }
  modalMode.value = 'edit'
  showModal.value = true
}

const viewDetails = (student) => {
  selectedStudent.value = { ...student }
  showDetailsModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
}

const handleSave = async (studentData) => {
  try {
    if (modalMode.value === 'create') {
      // Chamada para criar aluno
      await createStudentAPI(studentData)
    } else {
      // Chamada para atualizar aluno
      await updateStudentAPI(studentData)
    }
    fetchStudents() // Recarregar lista
    closeModal()
  } catch (error) {
    console.error('Erro ao salvar aluno:', error)
  }
}

const toggleStatus = async (student) => {
  try {
    // Chamada para alterar status
    await updateStudentStatusAPI(student.id, !student.active)
    fetchStudents() // Recarregar lista
  } catch (error) {
    console.error('Erro ao alterar status:', error)
  }
}

const exportToExcel = () => {
  // Implementar lógica de exportação
  console.log('Exportando dados para Excel...')
}

// Lifecycle
onMounted(() => {
  fetchStudents()
})
</script>

<style scoped>
.student-management-container {
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.title {
  color: #2c3e50;
  font-size: 1.5rem;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.add-button, .export-button {
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.3s;
}

.add-button {
  background-color: #4CAF50;
}

.add-button:hover {
  background-color: #3e8e41;
}

.export-button {
  background-color: #2196F3;
}

.export-button:hover {
  background-color: #0b7dda;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.search-input, 
.class-select,
.status-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
  max-width: 250px;
}

.student-table-container {
  overflow-x: auto;
  margin-bottom: 1.5rem;
}

.student-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.student-table th, .student-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.student-table th {
  background-color: #f1f1f1;
  font-weight: 600;
}

.sortable {
  cursor: pointer;
  user-select: none;
}

.sortable:hover {
  background-color: #e9e9e9;
}

.class-badge {
  background-color: #e1bee7;
  color: #7b1fa2;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.active {
  background-color: #e8f5e9;
  color: #388e3c;
}

.status-badge.inactive {
  background-color: #ffebee;
  color: #d32f2f;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn, 
.view-btn,
.status-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-btn {
  background-color: #2196F3;
  color: white;
}

.edit-btn:hover {
  background-color: #0b7dda;
}

.view-btn {
  background-color: #673AB7;
  color: white;
}

.view-btn:hover {
  background-color: #5e35b1;
}

.status-btn.activate {
  background-color: #4CAF50;
  color: white;
}

.status-btn.activate:hover {
  background-color: #3e8e41;
}

.status-btn.deactivate {
  background-color: #ff9800;
  color: white;
}

.status-btn.deactivate:hover {
  background-color: #e68a00;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.page-button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-button:hover:not(:disabled) {
  background-color: #f1f1f1;
}

.page-info {
  font-size: 0.9rem;
  color: #555;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #777;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #ddd;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .header-actions {
    width: 100%;
    flex-direction: column;
  }
  
  .filters {
    flex-direction: column;
  }
  
  .search-input, 
  .class-select,
  .status-select {
    max-width: 100%;
  }
  
  .actions {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .edit-btn, 
  .view-btn,
  .status-btn {
    width: 100%;
  }
}
</style>