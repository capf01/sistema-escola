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
  orderBy
} from 'firebase/firestore'

export const useStudentsStore = defineStore('students', () => {
  const db = inject('db')
  const students = ref([])
  const loading = ref(false)
  const error = ref(null)

  const studentsCollection = collection(db, 'students')

  // Carregar alunos em tempo real
  const loadStudents = () => {
    loading.value = true
    const q = query(studentsCollection, orderBy('name'))
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      students.value = []
      querySnapshot.forEach((doc) => {
        students.value.push({
          id: doc.id,
          ...doc.data()
        })
      })
      loading.value = false
    }, (err) => {
      error.value = err.message
      loading.value = false
    })

    return unsubscribe
  }

  const addStudent = async (studentData) => {
    loading.value = true
    try {
      await addDoc(studentsCollection, studentData)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const updateStudent = async (id, studentData) => {
    loading.value = true
    try {
      await updateDoc(doc(db, 'students', id), studentData)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const deleteStudent = async (id) => {
    loading.value = true
    try {
      await deleteDoc(doc(db, 'students', id))
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return { 
    students, 
    loading, 
    error, 
    loadStudents, 
    addStudent, 
    updateStudent, 
    deleteStudent 
  }
})