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

export const useGradesStore = defineStore('grades', () => {
  // Injeção das dependências do Firebase
  const db = inject('db')
  
  // Estado do store
  const grades = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  // Referência para a coleção de notas no Firestore
  const gradesCollection = collection(db, 'grades')
  
  /**
   * Carrega todas as notas
   */
  const loadGrades = async () => {
    loading.value = true
    error.value = null
    try {
      const q = query(
        gradesCollection,
        orderBy('createdAt', 'desc')
      )
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        grades.value = []
        querySnapshot.forEach((doc) => {
          grades.value.push({
            id: doc.id,
            ...doc.data()
          })
        })
      })
      
      return unsubscribe
    } catch (err) {
      error.value = err.message
      console.error('Erro ao carregar notas:', err)
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Registra uma nova nota
   * @param {Object} data - Dados da nota
   * @param {string} data.studentId - ID do aluno
   * @param {string} data.studentName - Nome do aluno
   * @param {string} data.class - Turma do aluno
   * @param {string} data.subject - Disciplina
   * @param {number} data.value - Valor da nota
   * @param {number} data.period - Período (1, 2, 3, etc.)
   * @param {string} [data.notes] - Observações
   */
  const addGrade = async (data) => {
    loading.value = true
    error.value = null
    try {
      const gradeData = {
        studentId: data.studentId,
        studentName: data.studentName,
        class: data.class,
        subject: data.subject,
        value: data.value,
        period: data.period,
        notes: data.notes || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      await addDoc(gradesCollection, gradeData)
    } catch (err) {
      error.value = err.message
      console.error('Erro ao registrar nota:', err)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Atualiza uma nota
   * @param {string} id - ID do documento
   * @param {Object} updates - Campos para atualizar
   */
  const updateGrade = async (id, updates) => {
    loading.value = true
    error.value = null
    try {
      const docRef = doc(db, 'grades', id)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })
    } catch (err) {
      error.value = err.message
      console.error('Erro ao atualizar nota:', err)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Remove uma nota
   * @param {string} id - ID do documento
   */
  const deleteGrade = async (id) => {
    loading.value = true
    error.value = null
    try {
      const docRef = doc(db, 'grades', id)
      await deleteDoc(docRef)
    } catch (err) {
      error.value = err.message
      console.error('Erro ao remover nota:', err)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Busca notas por aluno
   * @param {string} studentId - ID do aluno
   * @returns {Promise<Array>} - Lista de notas do aluno
   */
  const getGradesByStudent = async (studentId) => {
    loading.value = true
    error.value = null
    try {
      const q = query(
        gradesCollection,
        where('studentId', '==', studentId),
        orderBy('createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      const studentGrades = []
      querySnapshot.forEach((doc) => {
        studentGrades.push({
          id: doc.id,
          ...doc.data()
        })
      })
      return studentGrades
    } catch (err) {
      error.value = err.message
      console.error('Erro ao buscar notas por aluno:', err)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Busca notas por turma e disciplina
   * @param {string} classId - ID da turma
   * @param {string} subject - Disciplina
   * @returns {Promise<Array>} - Lista de notas filtradas
   */
  const getGradesByClassAndSubject = async (classId, subject) => {
    loading.value = true
    error.value = null
    try {
      const q = query(
        gradesCollection,
        where('class', '==', classId),
        where('subject', '==', subject),
        orderBy('createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      const filteredGrades = []
      querySnapshot.forEach((doc) => {
        filteredGrades.push({
          id: doc.id,
          ...doc.data()
        })
      })
      return filteredGrades
    } catch (err) {
      error.value = err.message
      console.error('Erro ao buscar notas por turma e disciplina:', err)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Calcula a média de um aluno em uma disciplina
   * @param {string} studentId - ID do aluno
   * @param {string} subject - Disciplina
   * @returns {Promise<number>} - Média do aluno
   */
  const calculateStudentAverage = async (studentId, subject) => {
    loading.value = true
    error.value = null
    try {
      const q = query(
        gradesCollection,
        where('studentId', '==', studentId),
        where('subject', '==', subject)
      )
      
      const querySnapshot = await getDocs(q)
      let sum = 0
      let count = 0
      
      querySnapshot.forEach((doc) => {
        const grade = doc.data().value
        sum += grade
        count++
      })
      
      return count > 0 ? sum / count : 0
    } catch (err) {
      error.value = err.message
      console.error('Erro ao calcular média do aluno:', err)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Calcula a média da turma em uma disciplina
   * @param {string} classId - ID da turma
   * @param {string} subject - Disciplina
   * @returns {Promise<number>} - Média da turma
   */
  const calculateClassAverage = async (classId, subject) => {
    loading.value = true
    error.value = null
    try {
      const q = query(
        gradesCollection,
        where('class', '==', classId),
        where('subject', '==', subject)
      )
      
      const querySnapshot = await getDocs(q)
      let sum = 0
      let count = 0
      
      querySnapshot.forEach((doc) => {
        const grade = doc.data().value
        sum += grade
        count++
      })
      
      return count > 0 ? sum / count : 0
    } catch (err) {
      error.value = err.message
      console.error('Erro ao calcular média da turma:', err)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Obtém todas as disciplinas cadastradas
   * @returns {Promise<Array>} - Lista de disciplinas
   */
  const getSubjects = async () => {
    loading.value = true
    error.value = null
    try {
      const q = query(gradesCollection)
      const querySnapshot = await getDocs(q)
      const subjects = new Set()
      
      querySnapshot.forEach((doc) => {
        subjects.add(doc.data().subject)
      })
      
      return Array.from(subjects).sort()
    } catch (err) {
      error.value = err.message
      console.error('Erro ao obter disciplinas:', err)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  return {
    // Estado
    grades,
    loading,
    error,
    
    // Ações
    loadGrades,
    addGrade,
    updateGrade,
    deleteGrade,
    getGradesByStudent,
    getGradesByClassAndSubject,
    calculateStudentAverage,
    calculateClassAverage,
    getSubjects
  }
})