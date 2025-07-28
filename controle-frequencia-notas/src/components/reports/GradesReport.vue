<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold">Relatório de Notas</h2>
      <button
        @click="generatePDF"
        class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Exportar PDF
      </button>
    </div>

    <div class="mb-4">
      <label class="block text-gray-700 mb-2">Filtrar por turma:</label>
      <select
        v-model="selectedClass"
        class="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Todas as Turmas</option>
        <option v-for="classOption in classOptions" :key="classOption" :value="classOption">
          {{ classOption }}
        </option>
      </select>
    </div>

    <div v-if="loading" class="text-center py-8">
      <p>Carregando dados...</p>
    </div>

    <div v-else-if="error" class="text-red-500 text-center py-8">
      <p>{{ error }}</p>
    </div>

    <div v-else>
      <div v-for="student in filteredStudents" :key="student.id" class="mb-8">
        <h3 class="text-lg font-medium mb-2">{{ student.name }} - Turma: {{ student.class }}</h3>
        <table class="min-w-full border border-gray-200 mb-4">
          <thead>
            <tr class="bg-gray-100">
              <th class="py-2 px-4 border">Disciplina</th>
              <th class="py-2 px-4 border">Nota 1</th>
              <th class="py-2 px-4 border">Nota 2</th>
              <th class="py-2 px-4 border">Nota 3</th>
              <th class="py-2 px-4 border">Média</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="subject in student.subjects" :key="subject.name">
              <td class="py-2 px-4 border">{{ subject.name }}</td>
              <td class="py-2 px-4 border">{{ subject.grade1 || '-' }}</td>
              <td class="py-2 px-4 border">{{ subject.grade2 || '-' }}</td>
              <td class="py-2 px-4 border">{{ subject.grade3 || '-' }}</td>
              <td class="py-2 px-4 border font-medium">
                {{ calculateAverage(subject) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStudentsStore } from '@/stores/students'
import { useGradesStore } from '@/stores/grades'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const studentsStore = useStudentsStore()
const gradesStore = useGradesStore()

const selectedClass = ref('')
const loading = ref(false)
const error = ref(null)

const { students } = studentsStore
const { grades } = gradesStore

onMounted(async () => {
  loading.value = true
  try {
    await studentsStore.loadStudents()
    await gradesStore.loadGrades()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})

const classOptions = computed(() => {
  const classes = new Set()
  students.value.forEach(student => classes.add(student.class))
  return Array.from(classes).sort()
})

const filteredStudents = computed(() => {
  let result = students.value.map(student => {
    const studentGrades = grades.value.filter(g => g.studentId === student.id)
    const subjects = {}
    
    studentGrades.forEach(grade => {
      if (!subjects[grade.subject]) {
        subjects[grade.subject] = {
          name: grade.subject,
          grade1: null,
          grade2: null,
          grade3: null
        }
      }
      subjects[grade.subject][`grade${grade.period}`] = grade.value
    })
    
    return {
      ...student,
      subjects: Object.values(subjects)
    }
  })
  
  if (selectedClass.value) {
    result = result.filter(student => student.class === selectedClass.value)
  }
  
  return result
})

const calculateAverage = (subject) => {
  const grades = [subject.grade1, subject.grade2, subject.grade3].filter(g => g !== null)
  if (grades.length === 0) return '-'
  const sum = grades.reduce((total, grade) => total + parseFloat(grade), 0)
  return (sum / grades.length).toFixed(1)
}

const generatePDF = () => {
  const doc = new jsPDF()
  const title = 'Relatório de Notas'
  const date = new Date().toLocaleDateString()
  
  doc.setFontSize(18)
  doc.text(title, 14, 20)
  doc.setFontSize(12)
  doc.text(`Data: ${date}`, 14, 30)
  
  if (selectedClass.value) {
    doc.text(`Turma: ${selectedClass.value}`, 14, 40)
  }
  
  let yPosition = 50
  
  filteredStudents.value.forEach(student => {
    doc.setFontSize(14)
    doc.text(`${student.name} - Turma: ${student.class}`, 14, yPosition)
    yPosition += 10
    
    const headers = [['Disciplina', 'Nota 1', 'Nota 2', 'Nota 3', 'Média']]
    const data = student.subjects.map(subject => [
      subject.name,
      subject.grade1 || '-',
      subject.grade2 || '-',
      subject.grade3 || '-',
      calculateAverage(subject)
    ])
    
    doc.autoTable({
      startY: yPosition,
      head: headers,
      body: data,
      margin: { left: 14 },
      styles: { fontSize: 10 }
    })
    
    yPosition = doc.lastAutoTable.finalY + 15
    
    // Add new page if needed
    if (yPosition > 280) {
      doc.addPage()
      yPosition = 20
    }
  })
  
  doc.save(`relatorio_notas_${date.replace(/\//g, '-')}.pdf`)
}
</script>