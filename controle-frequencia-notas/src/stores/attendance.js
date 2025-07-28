import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp
} from 'firebase/firestore'

export const useAttendanceStore = defineStore('attendance', () => {
  // Injeção das dependências do Firebase
  const db = inject('db')
  
  // Estado do store
  const attendanceRecords = ref([])
  const todayAttendance = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  // Referência para a coleção de frequência no Firestore
  const attendanceCollection = collection(db, 'attendance')
  
  /**
   * Carrega todos os registros de frequência
   */
  const loadAttendance = async () => {
    loading.value = true
    error.value = null
    try {
      const q = query(
        attendanceCollection,
        orderBy('date', 'desc')
      )
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        attendanceRecords.value = []
        querySnapshot.forEach((doc) => {
          attendanceRecords.value.push({
            id: doc.id,
            ...doc.data()
          })
        })
      })
      
      return unsubscribe
    } catch (err) {
      error.value = err.message
      console.error('Erro ao carregar frequência:', err)
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Carrega a frequência do dia atual
   */
  const loadTodayAttendance = async () => {
    loading.value = true
    error.value = null
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const q = query(
        attendanceCollection,
        where('date', '>=', today),
        orderBy('date', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      todayAttendance.value = []
      querySnapshot.forEach((doc) => {
        todayAttendance.value.push({
          id: doc.id,
          ...doc.data()
        })
      })
    } catch (err) {
      error.value = err.message
      console.error('Erro ao carregar frequência de hoje:', err)
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Registra a frequência de um aluno
   * @param {Object} data - Dados da frequência
   * @param {string} data.studentId - ID do aluno
   * @param {string} data.studentName - Nome do aluno
   * @param {string} data.class - Turma do aluno
   * @param {boolean} data.present - Se o aluno está presente
   * @param {string} [data.notes] - Observações
   */
  const recordAttendance = async (data) => {
    loading.value = true
    error.value = null
    try {
      const attendanceData = {
        studentId: data.studentId,
        studentName: data.studentName,
        class: data.class,
        present: data.present,
        notes: data.notes || '',
        date: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      await addDoc(attendanceCollection, attendanceData)
    } catch (err) {
      error.value = err.message
      console.error('Erro ao registrar frequência:', err)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Atualiza um registro de frequência
   * @param {string} id - ID do documento
   * @param {Object} updates - Campos para atualizar
   */
  const updateAttendance = async (id, updates) => {
    loading.value = true
    error.value = null
    try {
      const docRef = doc(db, 'attendance', id)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })
    } catch (err) {
      error.value = err.message
      console.error('Erro ao atualizar frequência:', err)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Remove um registro de frequência
   * @param {string} id - ID do documento
   */
  const deleteAttendance = async (id) => {
    loading.value = true
    error.value = null
    try {
      const docRef = doc(db, 'attendance', id)
      await deleteDoc(docRef)
    } catch (err) {
      error.value = err.message
      console.error('Erro ao remover frequência:', err)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Busca frequência por aluno
   * @param {string} studentId - ID do aluno
   * @returns {Promise<Array>} - Lista de registros de frequência
   */
  const getAttendanceByStudent = async (studentId) => {
    loading.value = true
    error.value = null
    try {
      const q = query(
        attendanceCollection,
        where('studentId', '==', studentId),
        orderBy('date', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      const records = []
      querySnapshot.forEach((doc) => {
        records.push({
          id: doc.id,
          ...doc.data()
        })
      })
      return records
    } catch (err) {
      error.value = err.message
      console.error('Erro ao buscar frequência por aluno:', err)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Busca frequência por turma e período
   * @param {string} classId - ID da turma
   * @param {Date} startDate - Data inicial
   * @param {Date} endDate - Data final
   * @returns {Promise<Array>} - Lista de registros de frequência
   */
  const getAttendanceByClass = async (classId, startDate, endDate) => {
    loading.value = true
    error.value = null
    try {
      const q = query(
        attendanceCollection,
        where('class', '==', classId),
        where('date', '>=', startDate),
        where('date', '<=', endDate),
        orderBy('date', 'asc')
      )
      
      const querySnapshot = await getDocs(q)
      const records = []
      querySnapshot.forEach((doc) => {
        records.push({
          id: doc.id,
          ...doc.data()
        })
      })
      return records
    } catch (err) {
      error.value = err.message
      console.error('Erro ao buscar frequência por turma:', err)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Calcula estatísticas de frequência
   * @param {Array} records - Registros de frequência
   * @returns {Object} - Estatísticas
   */
  const calculateAttendanceStats = (records) => {
    const total = records.length
    const present = records.filter(r => r.present).length
    const absent = total - present
    const attendanceRate = total > 0 ? (present / total) * 100 : 0
    
    return {
      total,
      present,
      absent,
      attendanceRate: attendanceRate.toFixed(1)
    }
  }
  
  return {
    // Estado
    attendanceRecords,
    todayAttendance,
    loading,
    error,
    
    // Ações
    loadAttendance,
    loadTodayAttendance,
    recordAttendance,
    updateAttendance,
    deleteAttendance,
    getAttendanceByStudent,
    getAttendanceByClass,
    calculateAttendanceStats
  }
})