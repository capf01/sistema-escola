<template>
  <NavBar />
  <div class="container mx-auto px-4 py-6">
    <router-view />
  </div>
</template>

<script setup>
import NavBar from '@/components/ui/NavBar.vue'
</script>

<style>
/* Estilos globais podem ser adicionados aqui */
</style>