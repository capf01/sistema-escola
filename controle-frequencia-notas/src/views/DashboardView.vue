<template>
  <div class="dashboard-layout">
    <!-- Barra de navegação -->
    <NavBar />
    
    <div class="dashboard-content">
      <!-- Sidebar -->
      <SideBar />
      
      <!-- Conteúdo principal -->
      <main class="main-content">
        <!-- Cabeçalho -->
        <div class="header-section">
          <div class="header-container">
            <div class="header-title-container">
              <h1 class="header-title">Dashboard</h1>
              <div class="header-actions">
                <span class="current-date">Hoje: {{ currentDate }}</span>
                <button 
                  @click="refreshData"
                  class="refresh-button"
                  :disabled="isLoading"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="refresh-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Estatísticas -->
        <div class="stats-section">
          <div class="stats-grid">
            <!-- Card Total de Alunos -->
            <div class="stats-card">
              <div class="card-content">
                <div class="card-icon-container bg-blue">
                  <svg xmlns="http://www.w3.org/2000/svg" class="card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div class="card-text">
                  <div class="card-label">Total de Alunos</div>
                  <div class="card-value">{{ stats.totalStudents }}</div>
                </div>
              </div>
            </div>

            <!-- Card Presença Hoje -->
            <div class="stats-card">
              <div class="card-content">
                <div class="card-icon-container bg-green">
                  <svg xmlns="http://www.w3.org/2000/svg" class="card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="card-text">
                  <div class="card-label">Presença Hoje</div>
                  <div class="card-value-container">
                    <div class="card-value">{{ stats.todayAttendance.present }}</div>
                    <div class="card-subtext">de {{ stats.totalStudents }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card Faltas Hoje -->
            <div class="stats-card">
              <div class="card-content">
                <div class="card-icon-container bg-red">
                  <svg xmlns="http://www.w3.org/2000/svg" class="card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div class="card-text">
                  <div class="card-label">Faltas Hoje</div>
                  <div class="card-value-container">
                    <div class="card-value">{{ stats.todayAttendance.absent }}</div>
                    <div class="card-subtext">de {{ stats.totalStudents }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card Média Geral -->
            <div class="stats-card">
              <div class="card-content">
                <div class="card-icon-container bg-yellow">
                  <svg xmlns="http://www.w3.org/2000/svg" class="card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                  </svg>
                </div>
                <div class="card-text">
                  <div class="card-label">Média Geral</div>
                  <div class="card-value-container">
                    <div class="card-value">{{ stats.averageGrade.toFixed(1) }}</div>
                    <div class="card-subtext">em 10.0</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Seção principal -->
        <div class="main-section">
          <div class="main-grid">
            <!-- Lista de Alunos -->
            <div class="student-list-section">
              <div class="list-card">
                <div class="list-header">
                  <h3 class="list-title">Lista de Alunos</h3>
                  <p class="list-subtitle">Gerencie a frequência e notas dos alunos</p>
                </div>
                <div class="list-content">
                  <StudentList />
                </div>
              </div>
            </div>

            <!-- Atividades Recentes -->
            <div class="activities-section">
              <div class="activities-card">
                <div class="activities-header">
                  <h3 class="activities-title">Atividades Recentes</h3>
                  <p class="activities-subtitle">Últimas atualizações no sistema</p>
                </div>
                <div class="activities-content">
                  <ul class="activities-list">
                    <li v-for="(activity, index) in recentActivities" :key="index" class="activity-item">
                      <div class="activity-content">
                        <div class="activity-icon-container">
                          <div class="activity-icon-bg">
                            <svg xmlns="http://www.w3.org/2000/svg" class="activity-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path v-if="activity.type === 'attendance'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                              <path v-else-if="activity.type === 'grade'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                          </div>
                        </div>
                        <div class="activity-text">
                          <p class="activity-description">
                            <span class="activity-user">{{ activity.user }}</span> {{ activity.action }}
                          </p>
                          <p class="activity-time">
                            <time :datetime="activity.datetime">{{ formatTime(activity.datetime) }}</time>
                          </p>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <div class="activities-footer">
                    <button
                      type="button"
                      class="view-all-button"
                    >
                      Ver todas as atividades
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStudentsStore } from '@/stores/students'
import { useAttendanceStore } from '@/stores/attendance'
import { useGradesStore } from '@/stores/grades'
import NavBar from '@/components/ui/NavBar.vue'
import SideBar from '@/components/ui/SideBar.vue'
import StudentList from '@/components/dashboard/StudentList.vue'

const studentsStore = useStudentsStore()
const attendanceStore = useAttendanceStore()
const gradesStore = useGradesStore()

const isLoading = ref(false)
const currentDate = ref(new Date().toLocaleDateString('pt-BR'))

const stats = ref({
  totalStudents: 0,
  todayAttendance: {
    present: 0,
    absent: 0
  },
  averageGrade: 0
})

const recentActivities = ref([
  {
    type: 'attendance',
    user: 'Prof. Silva',
    action: 'registrou a frequência de 25 alunos',
    datetime: '2023-05-15T09:30:00'
  },
  {
    type: 'grade',
    user: 'Prof. Oliveira',
    action: 'lançou notas de Matemática',
    datetime: '2023-05-15T10:15:00'
  },
  {
    type: 'system',
    user: 'Sistema',
    action: 'backup automático realizado',
    datetime: '2023-05-15T03:00:00'
  },
  {
    type: 'attendance',
    user: 'Prof. Santos',
    action: 'atualizou a frequência de 3 alunos',
    datetime: '2023-05-14T16:45:00'
  }
])

const formatTime = (datetime) => {
  const date = new Date(datetime)
  return date.toLocaleString('pt-BR')
}

const refreshData = async () => {
  isLoading.value = true
  try {
    await Promise.all([
      studentsStore.loadStudents(),
      attendanceStore.loadTodayAttendance(),
      gradesStore.loadGrades()
    ])
    
    // Atualizar estatísticas
    stats.value = {
      totalStudents: studentsStore.students.length,
      todayAttendance: {
        present: attendanceStore.todayAttendance.filter(a => a.present).length,
        absent: attendanceStore.todayAttendance.filter(a => !a.present).length
      },
      averageGrade: calculateAverageGrade()
    }
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
  } finally {
    isLoading.value = false
  }
}

const calculateAverageGrade = () => {
  if (!gradesStore.grades.length) return 0
  
  const sum = gradesStore.grades.reduce((total, grade) => total + grade.value, 0)
  return sum / gradesStore.grades.length
}

onMounted(() => {
  refreshData()
})
</script>

<style scoped>
.dashboard-layout {
  min-height: 100vh;
}

.dashboard-content {
  display: flex;
}

.main-content {
  flex: 1;
  padding-bottom: 2rem;
}

.header-section {
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-container {
  padding: 1.5rem 1rem;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
}

.header-title-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #111827;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.current-date {
  font-size: 0.875rem;
  color: #6b7280;
}

.refresh-button {
  padding: 0.5rem;
  color: #6b7280;
  border-radius: 9999px;
  transition: all 0.2s;
}

.refresh-button:hover:not(:disabled) {
  color: #374151;
  background-color: #f3f4f6;
}

.refresh-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.refresh-icon {
  height: 1.25rem;
  width: 1.25rem;
}

.stats-section {
  margin-top: 2rem;
  padding: 0 1rem;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.25rem;
}

@media (min-width: 640px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.stats-card {
  background-color: white;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
}

.card-content {
  padding: 1.5rem;
}

.card-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  padding: 0.75rem;
  width: 3rem;
  height: 3rem;
}

.bg-blue {
  background-color: #3b82f6;
}

.bg-green {
  background-color: #10b981;
}

.bg-red {
  background-color: #ef4444;
}

.bg-yellow {
  background-color: #f59e0b;
}

.card-icon {
  height: 1.5rem;
  width: 1.5rem;
  color: white;
}

.card-text {
  margin-left: 1.25rem;
  flex: 1;
  min-width: 0;
}

.card-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
}

.card-value-container {
  display: flex;
  align-items: baseline;
}

.card-subtext {
  margin-left: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.main-section {
  margin-top: 2rem;
  padding: 0 1rem;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
}

.main-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2rem;
}

@media (min-width: 1024px) {
  .main-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.student-list-section {
  grid-column: span 2;
}

.activities-section {
  grid-column: span 1;
}

.list-card, .activities-card {
  background-color: white;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
}

.list-header, .activities-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.list-title, .activities-title {
  font-size: 1.125rem;
  font-weight: 500;
  color: #111827;
}

.list-subtitle, .activities-subtitle {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.list-content, .activities-content {
  padding: 1.5rem;
}

.activities-list {
  list-style: none;
  padding: 0;
  margin: 0;
  border-top: 1px solid #e5e7eb;
}

.activity-item {
  padding: 1rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.activity-content {
  display: flex;
  gap: 0.75rem;
}

.activity-icon-container {
  flex-shrink: 0;
}

.activity-icon-bg {
  height: 2rem;
  width: 2rem;
  border-radius: 9999px;
  background-color: #dbeafe;
  display: flex;
  align-items: center;
  justify-content: center;
}

.activity-icon {
  height: 1.25rem;
  width: 1.25rem;
  color: #3b82f6;
}

.activity-text {
  min-width: 0;
}

.activity-description {
  font-size: 0.875rem;
  color: #1f2937;
  margin: 0;
}

.activity-user {
  font-weight: 500;
}

.activity-time {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.activities-footer {
  margin-top: 1.5rem;
}

.view-all-button {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  background-color: white;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.view-all-button:hover {
  background-color: #f9fafb;
}
</style>