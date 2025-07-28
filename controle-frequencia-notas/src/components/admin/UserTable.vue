<template>
  <div class="user-table">
    <div class="table-header">
      <button @click="showCreateModal = true" class="create-button">
        + Novo Usuário
      </button>
    </div>
    
    <table>
      <!-- Tabela de usuários -->
    </table>
    
    <UserCreateModal 
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="fetchUsers"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import UserCreateModal from './UserCreateModal.vue'

const showCreateModal = ref(false)
</script>