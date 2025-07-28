import { ref, computed } from 'vue'
import { useStudentsStore } from '@/stores/students'
import { useRouter } from 'vue-router'

export const useStudents = () => {
  const studentsStore = useStudentsStore()
  const router = useRouter()

  // Estados reativos para formulários
  const studentForm = ref({
    name: '',
    email: '',
    registrationNumber: '',
    birthDate: '',
    class: '',
    address: '',
    phone: '',
    active: true
  })

  // Estados para UI
  const isProcessing = ref(false)
  const errorMessage = ref('')
  const searchQuery = ref('')
  const selectedClass = ref('')
  const selectedStatus = ref('')

  // Computed properties
  const students = computed(() => studentsStore.students)
  const isLoading = computed(() => studentsStore.loading)
  const error = computed(() => studentsStore.error || errorMessage.value)
  
  // Opções para filtros
  const classOptions = computed(() => {
    const classes = new Set()
    studentsStore.students.forEach(student => classes.add(student.class))
    return Array.from(classes).sort()
  })

  // Alunos filtrados
  const filteredStudents = computed(() => {
    let result = studentsStore.students

    // Filtro por busca
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(student => 
        student.name.toLowerCase().includes(query) ||
        student.registrationNumber.toLowerCase().includes(query) ||
        student.email?.toLowerCase().includes(query)
      )
    }

    // Filtro por turma
    if (selectedClass.value) {
      result = result.filter(student => student.class === selectedClass.value)
    }

    // Filtro por status
    if (selectedStatus.value) {
      const isActive = selectedStatus.value === 'active'
      result = result.filter(student => student.active === isActive)
    }

    return result
  })

  /**
   * Carrega todos os alunos
   */
  const loadStudents = async () => {
    try {
      await studentsStore.loadStudents()
    } catch (error) {
      errorMessage.value = 'Erro ao carregar alunos'
      console.error(error)
    }
  }

  /**
   * Preenche o formulário com dados de um aluno existente
   */
  const setStudentForm = (student) => {
    studentForm.value = {
      name: student.name || '',
      email: student.email || '',
      registrationNumber: student.registrationNumber || '',
      birthDate: student.birthDate || '',
      class: student.class || '',
      address: student.address || '',
      phone: student.phone || '',
      active: student.active ?? true
    }
  }

  /**
   * Valida os dados do aluno
   */
  const validateStudent = () => {
    if (!studentForm.value.name) {
      return { isValid: false, error: 'O nome do aluno é obrigatório' }
    }
    
    if (!studentForm.value.registrationNumber) {
      return { isValid: false, error: 'O número de matrícula é obrigatório' }
    }
    
    if (!studentForm.value.class) {
      return { isValid: false, error: 'A turma do aluno é obrigatória' }
    }
    
    return { isValid: true }
  }

  /**
   * Adiciona um novo aluno
   */
  const addStudent = async () => {
    const validation = validateStudent()
    if (!validation.isValid) {
      errorMessage.value = validation.error
      return { success: false, error: validation.error }
    }

    isProcessing.value = true
    errorMessage.value = ''

    try {
      await studentsStore.addStudent(studentForm.value)
      resetForm()
      return { success: true }
    } catch (error) {
      errorMessage.value = error.message || 'Erro ao cadastrar aluno'
      return { success: false, error: errorMessage.value }
    } finally {
      isProcessing.value = false
    }
  }

  /**
   * Atualiza um aluno existente
   */
  const updateStudent = async (studentId) => {
    const validation = validateStudent()
    if (!validation.isValid) {
      errorMessage.value = validation.error
      return { success: false, error: validation.error }
    }

    isProcessing.value = true
    errorMessage.value = ''

    try {
      await studentsStore.updateStudent(studentId, studentForm.value)
      resetForm()
      return { success: true }
    } catch (error) {
      errorMessage.value = error.message || 'Erro ao atualizar aluno'
      return { success: false, error: errorMessage.value }
    } finally {
      isProcessing.value = false
    }
  }

  /**
   * Remove um aluno
   */
  const deleteStudent = async (studentId) => {
    isProcessing.value = true
    errorMessage.value = ''

    try {
      await studentsStore.deleteStudent(studentId)
      return { success: true }
    } catch (error) {
      errorMessage.value = error.message || 'Erro ao remover aluno'
      return { success: false, error: errorMessage.value }
    } finally {
      isProcessing.value = false
    }
  }

  /**
   * Navega para a página de detalhes do aluno
   */
  const goToStudentDetails = (studentId) => {
    router.push(`/students/${studentId}`)
  }

  /**
   * Reseta o formulário
   */
  const resetForm = () => {
    studentForm.value = {
      name: '',
      email: '',
      registrationNumber: '',
      birthDate: '',
      class: '',
      address: '',
      phone: '',
      active: true
    }
    errorMessage.value = ''
  }

  /**
   * Reseta todos os filtros
   */
  const resetFilters = () => {
    searchQuery.value = ''
    selectedClass.value = ''
    selectedStatus.value = ''
  }

  return {
    // Estados
    studentForm,
    isProcessing,
    error,
    searchQuery,
    selectedClass,
    selectedStatus,
    
    // Computed
    students,
    filteredStudents,
    isLoading,
    classOptions,
    
    // Métodos
    loadStudents,
    setStudentForm,
    addStudent,
    updateStudent,
    deleteStudent,
    goToStudentDetails,
    resetForm,
    resetFilters
  }
}