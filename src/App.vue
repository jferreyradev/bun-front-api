<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { usePeriodoStore } from '@/stores/periodo.js'
import { useTipoLiquidacionStore } from '@/stores/tipoLiquidacion.js'
import { storeToRefs } from 'pinia'
const nombreApp = import.meta.env.VITE_NOMBRE_APP
const periodoStore = usePeriodoStore()

const tipoLiquidacionStore = useTipoLiquidacionStore()
const { tipoSeleccionado } = storeToRefs(tipoLiquidacionStore)

const { periodo } = storeToRefs(periodoStore)
function formatoPeriodo(p) {
  if (!p || !/^\d{4}-\d{2}$/.test(p)) return p
  const [anio, mes] = p.split('-')
  const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
  return `${meses[parseInt(mes,10)-1]} ${anio}`
}
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
      <v-app-bar-title class="ml-2">{{ nombreApp || 'Panel de Control' }}</v-app-bar-title>
      <v-spacer />
      <div class="periodo-bar-text">
        <v-icon class="mr-1" size="18">mdi-calendar</v-icon>
        <span>{{ periodo ? formatoPeriodo(periodo) : 'Sin periodo seleccionado' }}</span>
      </div>
      <div>
        {{tipoSeleccionado}}
      </div>
    </v-app-bar>
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<style scoped>
.periodo-bar-text {
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 1rem;
  color: #fff;
  margin-right: 16px;
}
.v-application {
  background: #f5f5f5;
}
</style>
