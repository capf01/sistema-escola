<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold">Lista de Alunos</h2>
      <div class="flex space-x-2">
        <select
          v-model="selectedClass"
          class="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas as Turmas</option>
          <option v-for="classOption in classOptions" :key="classOption" :value="classOption">
            {{ classOption }}
          </option>
        </select>
        <button
          @click="openAddStudent"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Adicionar Aluno
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-8">
      <p>Carregando alunos...</p>
    </div>

    <div v-else-if="error" class="text-red-500 text-center py-8">
      <p>{{ error }}</p>
    </div>

    <div v-else>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200">
          <thead>
            <tr class="bg-gray-100">
              <th class="py-2 px-4 border-b">Nome</th>
              <th class="py-2 px-4 border-b">Turma</th>
              <th class="py-2 px-4 border-b">Matrícula</th>
              <th class="py-2 px-4 border-b">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in filteredStudents" :key="student.id" class="hover:bg-gray-50">
              <td class="py-2 px-4 border-b">{{ student.name }}</td>
              <td class="py-2 px-4 border-b">{{ student.class }}</td>
              <td class="py-2 px-4 border-b">{{ student.registrationNumber }}</td>
              <td class="py-2 px-4 border-b flex space-x-2">
                <button
                  @click="openEditStudent(student)"
                  class="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-200"
                >
                  Editar
                </button>
                <button
                  @click="openAttendance(student)"
                  class="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
                >
                  Frequência
                </button>
                <button
                  @click="openGrades(student)"
                  class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                >
                  Notas
                </button>
                <button
                  @click="deleteStudent(student.id)"
                  class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                >
                  Excluir
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <StudentForm
      v-if="showStudentForm"
      :student="currentStudent"
      :loading="formLoading"
      @submit="handleStudentSubmit"
      @cancel="closeStudentForm"
    />

    <AttendanceForm
      v-if="showAttendanceForm"
      :student="currentStudent"
      @close="closeAttendanceForm"
    />

    <GradesForm
      v-if="showGradesForm"
      :student="currentStudent"
      @close="closeGradesForm"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStudentsStore } from '@/stores/students'
import StudentForm from '@/components/students/StudentForm.vue'
import AttendanceForm from '@/components/dashboard/AttendanceForm.vue'
import GradesForm from '@/components/dashboard/GradesForm.vue'

const studentsStore = useStudentsStore()

const selectedClass = ref('')
const showStudentForm = ref(false)
const showAttendanceForm = ref(false)
const showGradesForm = ref(false)
const currentStudent = ref(null)
const formLoading = ref(false)

const { students, loading, error, loadStudents, addStudent, updateStudent, deleteStudent } = studentsStore

onMounted(() => {
  loadStudents()
})

const classOptions = computed(() => {
  const classes = new Set()
  students.value.forEach(student => classes.add(student.class))
  return Array.from(classes).sort()
})

const filteredStudents = computed(() => {
  if (!selectedClass.value) return students.value
  return students.value.filter(student => student.class === selectedClass.value)
})

const openAddStudent = () => {
  currentStudent.value = null
  showStudentForm.value = true
}

const openEditStudent = (student) => {
  currentStudent.value = student
  showStudentForm.value = true
}

const openAttendance = (student) => {
  currentStudent.value = student
  showAttendanceForm.value = true
}

const openGrades = (student) => {
  currentStudent.value = student
  showGradesForm.value = true
}

const closeStudentForm = () => {
  showStudentForm.value = false
}

const closeAttendanceForm = () => {
  showAttendanceForm.value = false
}

const closeGradesForm = () => {
  showGradesForm.value = false
}

const handleStudentSubmit = async (studentData) => {
  formLoading.value = true
  try {
    if (currentStudent.value) {
      await updateStudent(currentStudent.value.id, studentData)
    } else {
      await addStudent(studentData)
    }
    showStudentForm.value = false
  } catch (err) {
    console.error(err)
  } finally {
    formLoading.value = false
  }
}
</script>