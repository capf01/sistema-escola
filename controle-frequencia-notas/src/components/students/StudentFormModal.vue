<template>
  <div class="student-form-modal">
    <div class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ isEditing ? 'Editar Aluno' : 'Adicionar Novo Aluno' }}</h2>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="name">Nome Completo:</label>
              <input
                type="text"
                id="name"
                v-model="formData.name"
                required
                placeholder="Digite o nome completo"
              />
            </div>

            <div class="form-group">
              <label for="email">E-mail:</label>
              <input
                type="email"
                id="email"
                v-model="formData.email"
                required
                placeholder="Digite o e-mail"
              />
            </div>

            <div class="form-group">
              <label for="birthDate">Data de Nascimento:</label>
              <input
                type="date"
                id="birthDate"
                v-model="formData.birthDate"
                required
              />
            </div>

            <div class="form-group">
              <label for="class">Turma:</label>
              <select id="class" v-model="formData.classId" required>
                <option value="" disabled>Selecione uma turma</option>
                <option v-for="classOption in classes" :key="classOption.id" :value="classOption.id">
                  {{ classOption.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="status">Status:</label>
              <select id="status" v-model="formData.status" required>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
                <option value="suspended">Suspenso</option>
              </select>
            </div>

            <div class="form-actions">
              <button type="button" class="cancel-btn" @click="closeModal">
                Cancelar
              </button>
              <button type="submit" class="submit-btn">
                {{ isEditing ? 'Atualizar' : 'Cadastrar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StudentFormModal',
  props: {
    student: {
      type: Object,
      default: null
    },
    classes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      formData: {
        name: '',
        email: '',
        birthDate: '',
        classId: '',
        status: 'active'
      },
      isEditing: false
    }
  },
  watch: {
    student: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.isEditing = true
          this.formData = { ...newVal }
        } else {
          this.isEditing = false
          this.resetForm()
        }
      }
    }
  },
  methods: {
    resetForm() {
      this.formData = {
        name: '',
        email: '',
        birthDate: '',
        classId: '',
        status: 'active'
      }
    },
    closeModal() {
      this.$emit('close')
      this.resetForm()
    },
    handleSubmit() {
      this.$emit('submit', this.formData)
      this.closeModal()
    }
  }
}
</script>

<style scoped>
.student-form-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 16px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #444;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
}

.cancel-btn {
  padding: 10px 16px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  color: #333;
}

.submit-btn {
  padding: 10px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #45a049;
}
</style>