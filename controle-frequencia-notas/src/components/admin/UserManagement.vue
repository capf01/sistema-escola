<template>
  <div class="user-management-container">
    <div class="header">
      <h2 class="title">Gerenciamento de Usuários</h2>
      <button @click="openCreateModal" class="add-button">
        <i class="fas fa-plus"></i> Adicionar Usuário
      </button>
    </div>

    <div class="filters">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Pesquisar usuários..."
        class="search-input"
      />
      <select v-model="roleFilter" class="role-select">
        <option value="">Todos os perfis</option>
        <option value="admin">Administrador</option>
        <option value="teacher">Professor</option>
        <option value="student">Aluno</option>
      </select>
    </div>

    <div class="user-table-container">
      <table class="user-table">
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
            <th>Perfil</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span :class="`role-badge ${user.role}`">
                {{ formatRole(user.role) }}
              </span>
            </td>
            <td>
              <span :class="`status-badge ${user.active ? 'active' : 'inactive'}`">
                {{ user.active ? 'Ativo' : 'Inativo' }}
              </span>
            </td>
            <td class="actions">
              <button @click="editUser(user)" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <button @click="confirmDelete(user)" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="filteredUsers.length === 0" class="empty-state">
      <i class="fas fa-users empty-icon"></i>
      <p>Nenhum usuário encontrado</p>
    </div>

    <!-- Modal de criação/edição -->
    <UserModal
      v-if="showModal"
      :user="selectedUser"
      :mode="modalMode"
      @close="closeModal"
      @save="handleSave"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import UserModal from './UserModal.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Dados
const users = ref([])
const searchQuery = ref('')
const roleFilter = ref('')
const sortField = ref('name')
const sortDirection = ref('asc')
const showModal = ref(false)
const selectedUser = ref(null)
const modalMode = ref('create') // 'create' or 'edit'

// Buscar usuários (simulando API)
const fetchUsers = async () => {
  try {
    // Substituir por chamada real à API
    const response = await fetchUsersFromAPI()
    users.value = response
  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
  }
}

// Filtros e ordenação
const filteredUsers = computed(() => {
  let result = users.value
  
  // Filtro por texto
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(user => 
      user.name.toLowerCase().includes(query) || 
      user.email.toLowerCase().includes(query)
    )
  }
  
  // Filtro por perfil
  if (roleFilter.value) {
    result = result.filter(user => user.role === roleFilter.value)
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
const formatRole = (role) => {
  const roles = {
    admin: 'Administrador',
    teacher: 'Professor',
    student: 'Aluno'
  }
  return roles[role] || role
}

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
  selectedUser.value = null
  modalMode.value = 'create'
  showModal.value = true
}

const editUser = (user) => {
  selectedUser.value = { ...user }
  modalMode.value = 'edit'
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const handleSave = async (userData) => {
  try {
    if (modalMode.value === 'create') {
      await authStore.registerUser(userData)
    } else {
      // Chamada para atualizar usuário
      await updateUserAPI(userData)
    }
    fetchUsers() // Recarregar lista
    closeModal()
  } catch (error) {
    console.error('Erro ao salvar usuário:', error)
  }
}

const confirmDelete = (user) => {
  if (confirm(`Tem certeza que deseja excluir ${user.name}?`)) {
    deleteUser(user.id)
  }
}

const deleteUser = async (userId) => {
  try {
    // Chamada para deletar usuário
    await deleteUserAPI(userId)
    fetchUsers() // Recarregar lista
  } catch (error) {
    console.error('Erro ao excluir usuário:', error)
  }
}

// Lifecycle
onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.user-management-container {
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

.search-input, .role-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
  max-width: 300px;
}

.user-table-container {
  overflow-x: auto;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.user-table th, .user-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.user-table th {
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

.role-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.role-badge.admin {
  background-color: #ffeb3b;
  color: #ff9800;
}

.role-badge.teacher {
  background-color: #e3f2fd;
  color: #1976d2;
}

.role-badge.student {
  background-color: #e8f5e9;
  color: #388e3c;
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

.edit-btn, .delete-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
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
  
  .search-input, .role-select {
    max-width: 100%;
  }
}
</style>