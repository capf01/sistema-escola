<template>
  <div class="teacher-management-container">
    <div class="header">
      <h2 class="title">Gerenciamento de Professores</h2>
      <button @click="openCreateModal" class="add-button">
        <i class="fas fa-plus"></i> Adicionar Professor
      </button>
    </div>

    <div class="filters">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Pesquisar professores..."
        class="search-input"
      />
      <select v-model="statusFilter" class="status-select">
        <option value="">Todos os status</option>
        <option value="active">Ativos</option>
        <option value="inactive">Inativos</option>
      </select>
      <select v-model="subjectFilter" class="subject-select">
        <option value="">Todas as disciplinas</option>
        <option v-for="subject in subjects" :key="subject" :value="subject">
          {{ subject }}
        </option>
      </select>
    </div>

    <div class="teacher-table-container">
      <table class="teacher-table">
        <thead>
          <tr>
            <th @click="sortBy('name')" class="sortable">
              Nome
              <i :class="sortIcon('name')"></i>
            </th>
            <th @click="sortBy('email')" class="sortable">
              Email
              <i :class="sortIcon('email')"></i>
            </th>
            <th>Disciplinas</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="teacher in filteredTeachers" :key="teacher.id">
            <td>{{ teacher.name }}</td>
            <td>{{ teacher.email }}</td>
            <td>
              <div class="subjects-container">
                <span 
                  v-for="subject in teacher.subjects" 
                  :key="subject" 
                  class="subject-badge"
                >
                  {{ subject }}
                </span>
              </div>
            </td>
            <td>
              <span :class="`status-badge ${teacher.active ? 'active' : 'inactive'}`">
                {{ teacher.active ? 'Ativo' : 'Inativo' }}
              </span>
            </td>
            <td class="actions">
              <button @click="editTeacher(teacher)" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <button @click="confirmDelete(teacher)" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
              <button 
                @click="toggleStatus(teacher)" 
                :class="`status-btn ${teacher.active ? 'deactivate' : 'activate'}`"
              >
                <i :class="`fas ${teacher.active ? 'fa-user-slash' : 'fa-user-check'}`"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="filteredTeachers.length === 0" class="empty-state">
      <i class="fas fa-chalkboard-teacher empty-icon"></i>
      <p>Nenhum professor encontrado</p>
    </div>

    <!-- Modal de criação/edição -->
    <TeacherModal
      v-if="showModal"
      :teacher="selectedTeacher"
      :mode="modalMode"
      :subjects="subjects"
      @close="closeModal"
      @save="handleSave"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TeacherModal from './TeacherModal.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Dados
const teachers = ref([])
const searchQuery = ref('')
const statusFilter = ref('')
const subjectFilter = ref('')
const subjects = ref(['Matemática', 'Português', 'História', 'Geografia', 'Ciências', 'Inglês', 'Artes', 'Educação Física'])
const sortField = ref('name')
const sortDirection = ref('asc')
const showModal = ref(false)
const selectedTeacher = ref(null)
const modalMode = ref('create') // 'create' or 'edit'

// Buscar professores (simulando API)
const fetchTeachers = async () => {
  try {
    // Substituir por chamada real à API
    const response = await fetchTeachersFromAPI()
    teachers.value = response
  } catch (error) {
    console.error('Erro ao buscar professores:', error)
  }
}

// Filtros e ordenação
const filteredTeachers = computed(() => {
  let result = teachers.value
  
  // Filtro por texto
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(teacher => 
      teacher.name.toLowerCase().includes(query) || 
      teacher.email.toLowerCase().includes(query)
    )
  }
  
  // Filtro por status
  if (statusFilter.value) {
    result = result.filter(teacher => 
      statusFilter.value === 'active' ? teacher.active : !teacher.active
    )
  }
  
  // Filtro por disciplina
  if (subjectFilter.value) {
    result = result.filter(teacher => 
      teacher.subjects.includes(subjectFilter.value)
    )
  }
  
  // Ordenação
  return [...result].sort((a, b) => {
    const fieldA = a[sortField.value]
    const fieldB = b[sortField.value]
    
    if (fieldA < fieldB) return sortDirection.value === 'asc' ? -1 : 1
    if (fieldA > fieldB) return sortDirection.value === 'asc' ? 1 : -1
    return 0
  })
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

// Modal functions
const openCreateModal = () => {
  selectedTeacher.value = null
  modalMode.value = 'create'
  showModal.value = true
}

const editTeacher = (teacher) => {
  selectedTeacher.value = { ...teacher }
  modalMode.value = 'edit'
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const handleSave = async (teacherData) => {
  try {
    if (modalMode.value === 'create') {
      // Chamada para criar professor
      await createTeacherAPI(teacherData)
    } else {
      // Chamada para atualizar professor
      await updateTeacherAPI(teacherData)
    }
    fetchTeachers() // Recarregar lista
    closeModal()
  } catch (error) {
    console.error('Erro ao salvar professor:', error)
  }
}

const confirmDelete = (teacher) => {
  if (confirm(`Tem certeza que deseja excluir ${teacher.name}?`)) {
    deleteTeacher(teacher.id)
  }
}

const deleteTeacher = async (teacherId) => {
  try {
    // Chamada para deletar professor
    await deleteTeacherAPI(teacherId)
    fetchTeachers() // Recarregar lista
  } catch (error) {
    console.error('Erro ao excluir professor:', error)
  }
}

const toggleStatus = async (teacher) => {
  try {
    // Chamada para alterar status
    await updateTeacherStatusAPI(teacher.id, !teacher.active)
    fetchTeachers() // Recarregar lista
  } catch (error) {
    console.error('Erro ao alterar status:', error)
  }
}

// Lifecycle
onMounted(() => {
  fetchTeachers()
})
</script>

<style scoped>
.teacher-management-container {
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

.add-button {
  background-color: #4CAF50;
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

.add-button:hover {
  background-color: #3e8e41;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.search-input, 
.status-select,
.subject-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
  max-width: 250px;
}

.teacher-table-container {
  overflow-x: auto;
}

.teacher-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.teacher-table th, .teacher-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.teacher-table th {
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

.subjects-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.subject-badge {
  background-color: #e3f2fd;
  color: #1976d2;
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
.delete-btn,
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

.delete-btn {
  background-color: #f44336;
  color: white;
}

.delete-btn:hover {
  background-color: #d32f2f;
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
  
  .filters {
    flex-direction: column;
  }
  
  .search-input, 
  .status-select,
  .subject-select {
    max-width: 100%;
  }
  
  .actions {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .edit-btn, 
  .delete-btn,
  .status-btn {
    width: 100%;
  }
}
</style>