<template>
  <div>
    <button @click="showDeleteModal = true">Delete Student</button>
    
    <ConfirmationModal
      :is-open="showDeleteModal"
      title="Excluir Aluno"
      message="Tem certeza que deseja excluir este aluno? Esta ação não pode ser desfeita."
      confirm-text="Excluir"
      :is-loading="isDeleting"
      @close="showDeleteModal = false"
      @confirm="deleteStudent"
    />
  </div>
</template>

<script>
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue'

export default {
  components: { ConfirmationModal },
  data() {
    return {
      showDeleteModal: false,
      isDeleting: false
    }
  },
  methods: {
    async deleteStudent() {
      this.isDeleting = true
      try {
        // Perform delete operation
        await api.deleteStudent(this.studentId)
        this.showDeleteModal = false
      } finally {
        this.isDeleting = false
      }
    }
  }
}
</script>