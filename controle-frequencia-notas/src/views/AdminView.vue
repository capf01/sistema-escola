<template>
  <div class="admin-view">
    <SideBar />
    <div class="admin-content">
      <h1>Painel Administrativo</h1>
      
      <div class="admin-sections">
        <section class="users-section">
          <h2>Gerenciamento de Usuários</h2>
          <AdminUserTable />
        </section>
        
        <section class="settings-section">
          <h2>Configurações do Sistema</h2>
          <SystemSettings />
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import SideBar from '@/components/ui/SideBar.vue'
import AdminUserTable from '@/components/admin/UserTable.vue'
import SystemSettings from '@/components/admin/SystemSettings.vue'
</script>