<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-menu offset-y>
        <template #activator="{ props }">
          <v-btn v-bind="props" color="secondary" dark icon="mdi-menu">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item to="/" title="Inicio" />
          <v-list-item to="/users" title="Usuarios" />
          <v-list-item to="/reports" title="Reportes" />
          <v-list-item to="/config" title="Configuración" />
          <v-list-item to="/sql" title="Consultas SQL" />
          <v-list-item to="/procedures" title="Procedimientos" />
          <v-list-item to="/about" title="Acerca" />
        </v-list>
      </v-menu>
      <v-app-bar-title class="ml-2">Panel de Control</v-app-bar-title>
      <v-spacer />
    </v-app-bar>
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<style scoped>
.v-application {
  background: #f5f5f5;
}
</style>
