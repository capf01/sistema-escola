import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/AuthView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/students',
    name: 'students',
    component: () => import('@/views/StudentsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/reports',
    name: 'reports',
    component: () => import('@/views/ReportsView.vue'),
    meta: { requiresAuth: true }
  },
  // Novas rotas administrativas
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/AdminView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('@/components/admin/UserManagement.vue')
      },
      {
        path: 'teachers',
        name: 'admin-teachers',
        component: () => import('@/components/admin/TeacherManagement.vue')
      },
      {
        path: 'students',
        name: 'admin-students',
        component: () => import('@/components/admin/StudentManagement.vue')
      }
    ]
  },
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: () => import('@/views/UnauthorizedView.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Se a rota requer autenticação e o usuário não está logado
  if (to.meta.requiresAuth && !authStore.user) {
    next('/login')
  } 
  // Se a rota é para guests e o usuário está logado
  else if (to.meta.requiresGuest && authStore.user) {
    next('/')
  }
  // Se a rota requer admin e o usuário não é admin
  else if (to.meta.requiresAdmin && (!authStore.user || !authStore.isAdmin)) {
    next('/unauthorized')
  }
  // Permite o acesso
  else {
    next()
  }
})

export default router