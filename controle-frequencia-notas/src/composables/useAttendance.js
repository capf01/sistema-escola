import { ref, computed } from 'vue'
import { useAttendanceStore } from '@/stores/attendance'
import { useStudentsStore } from '@/stores/students'

export const useAttendance = () => {
  const attendanceStore = useAttendanceStore()
  const studentsStore = useStudentsStore()

  // Estados reativos
  const date = ref(new Date().toISOString().split('T')[0])
  const selectedClass = ref('')
  const presentStudents = ref([])
  const notes = ref('')
  const isProcessing = ref(false)
  const errorMessage = ref('')

  // Computed properties
  const attendanceRecords = computed(() => attendanceStore.attendanceRecords)
  const todayAttendance = computed(() => attendanceStore.todayAttendance)
  const isLoading = computed(() => attendanceStore.loading)
  const error = computed(() => attendanceStore.error || errorMessage.value)
  
  // Opções de turma
  const classOptions = computed(() => {
    const classes = new Set()
    studentsStore.students.forEach(student => classes.add(student.class))
    return Array.from(classes).sort()
  })

  // Alunos filtrados por turma
  const studentsByClass = computed(() => {
    if (!selectedClass.value) return []
    return studentsStore.students.filter(student => student.class === selectedClass.value)
  })

  /**
   * Carrega todos os registros de frequência
   */
  const loadAttendanceRecords = async () => {
    try {
      await attendanceStore.loadAttendance()
    } catch (error) {
      errorMessage.value = 'Erro ao carregar registros de frequência'
      console.error(error)
    }
  }

  /**
   * Carrega a frequência do dia atual
   */
  const loadTodayAttendance = async () => {
    try {
      await attendanceStore.loadTodayAttendance()
    } catch (error) {
      errorMessage.value = 'Erro ao carregar frequência de hoje'
      console.error(error)
    }
  }

  /**
   * Registra a frequência para uma turma
   */
  const recordClassAttendance = async () => {
    if (!selectedClass.value) {
      errorMessage.value = 'Selecione uma turma'
      return { success: false, error: errorMessage.value }
    }

    if (studentsByClass.value.length === 0) {
      errorMessage.value = 'Nenhum aluno encontrado nesta turma'
      return { success: false, error: errorMessage.value }
    }

    isProcessing.value = true
    errorMessage.value = ''

    try {
      // Registrar presença para cada aluno da turma
      const promises = studentsByClass.value.map(student => {
        return attendanceStore.recordAttendance({
          studentId: student.id,
          studentName: student.name,
          class: selectedClass.value,
          present: presentStudents.value.includes(student.id),
          date: date.value,
          notes: notes.value
        })
      })

      await Promise.all(promises)
      
      return { success: true }
    } catch (error) {
      errorMessage.value = 'Erro ao registrar frequência'
      console.error(error)
      return { success: false, error: errorMessage.value }
    } finally {
      isProcessing.value = false
    }
  }

  /**
   * Atualiza um registro de frequência
   */
  const updateAttendanceRecord = async (recordId, updates) => {
    isProcessing.value = true
    errorMessage.value = ''

    try {
      await attendanceStore.updateAttendance(recordId, updates)
      return { success: true }
    } catch (error) {
      errorMessage.value = 'Erro ao atualizar registro'
      console.error(error)
      return { success: false, error: errorMessage.value }
    } finally {
      isProcessing.value = false
    }
  }

  /**
   * Remove um registro de frequência
   */
  const deleteAttendanceRecord = async (recordId) => {
    isProcessing.value = true
    errorMessage.value = ''

    try {
      await attendanceStore.deleteAttendance(recordId)
      return { success: true }
    } catch (error) {
      errorMessage.value = 'Erro ao remover registro'
      console.error(error)
      return { success: false, error: errorMessage.value }
    } finally {
      isProcessing.value = false
    }
  }

  /**
   * Obtém a frequência de um aluno específico
   */
  const getStudentAttendance = async (studentId) => {
    try {
      return await attendanceStore.getAttendanceByStudent(studentId)
    } catch (error) {
      errorMessage.value = 'Erro ao buscar frequência do aluno'
      console.error(error)
      return []
    }
  }

  /**
   * Obtém a frequência de uma turma em um período
   */
  const getClassAttendance = async (classId, startDate, endDate) => {
    try {
      return await attendanceStore.getAttendanceByClass(classId, startDate, endDate)
    } catch (error) {
      errorMessage.value = 'Erro ao buscar frequência da turma'
      console.error(error)
      return []
    }
  }

  /**
   * Calcula estatísticas de frequência
   */
  const calculateAttendanceStats = (records) => {
    return attendanceStore.calculateAttendanceStats(records)
  }

  /**
   * Alterna a presença de um aluno
   */
  const toggleStudentPresence = (studentId) => {
    const index = presentStudents.value.indexOf(studentId)
    if (index === -1) {
      presentStudents.value.push(studentId)
    } else {
      presentStudents.value.splice(index, 1)
    }
  }

  /**
   * Verifica se um aluno está marcado como presente
   */
  const isStudentPresent = (studentId) => {
    return presentStudents.value.includes(studentId)
  }

  /**
   * Reseta o formulário de frequência
   */
  const resetForm = () => {
    selectedClass.value = ''
    presentStudents.value = []
    notes.value = ''
    errorMessage.value = ''
  }

  return {
    // Estados
    date,
    selectedClass,
    presentStudents,
    notes,
    isProcessing,
    
    // Computed
    attendanceRecords,
    todayAttendance,
    isLoading,
    error,
    classOptions,
    studentsByClass,
    
    // Métodos
    loadAttendanceRecords,
    loadTodayAttendance,
    recordClassAttendance,
    updateAttendanceRecord,
    deleteAttendanceRecord,
    getStudentAttendance,
    getClassAttendance,
    calculateAttendanceStats,
    toggleStudentPresence,
    isStudentPresent,
    resetForm
  }
}