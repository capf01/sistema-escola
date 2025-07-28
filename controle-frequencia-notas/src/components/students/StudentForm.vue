<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-xl font-semibold mb-4">{{ editing ? 'Editar Aluno' : 'Adicionar Aluno' }}</h2>
    <form @submit.prevent="handleSubmit">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-gray-700 mb-1">Nome Completo</label>
          <input
            v-model="form.name"
            type="text"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label class="block text-gray-700 mb-1">Turma</label>
          <input
            v-model="form.class"
            type="text"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label class="block text-gray-700 mb-1">Data de Nascimento</label>
          <input
            v-model="form.birthDate"
            type="date"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label class="block text-gray-700 mb-1">Número de Matrícula</label>
          <input
            v-model="form.registrationNumber"
            type="text"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
      <div class="flex justify-end space-x-2">
        <button
          type="button"
          @click="$emit('cancel')"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-200"
        >
          Cancelar
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
          :disabled="loading"
        >
          {{ loading ? 'Salvando...' : 'Salvar' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  student: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

const form = ref({
  name: '',
  class: '',
  birthDate: '',
  registrationNumber: ''
})

const editing = ref(false)

watch(() => props.student, (newVal) => {
  if (newVal) {
    editing.value = true
    form.value = { ...newVal }
  } else {
    editing.value = false
    resetForm()
  }
}, { immediate: true })

const resetForm = () => {
  form.value = {
    name: '',
    class: '',
    birthDate: '',
    registrationNumber: ''
  }
}

const handleSubmit = () => {
  emit('submit', form.value)
}
</script>