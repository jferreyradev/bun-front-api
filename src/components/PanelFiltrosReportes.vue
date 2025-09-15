
<template>
  <v-card flat class="pa-2">
    <v-row dense class="align-center mb-2">
      <v-col cols="12" md="4">
        <v-select
          v-model="consultaSeleccionada"
          :items="consultas"
          item-title="label"
          item-value="id"
          label="Tipo de consulta"
          dense
          outlined
          hide-details
          class="mb-2"
        />
      </v-col>
      <v-col cols="12" md="8" class="d-flex justify-end align-center">
        <v-btn icon @click="mostrarFiltros = !mostrarFiltros" :aria-label="mostrarFiltros ? 'Ocultar filtros' : 'Mostrar filtros'">
          <v-icon>{{ mostrarFiltros ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-btn>
        <span class="ml-2">Filtros</span>
      </v-col>
    </v-row>
    <v-expand-transition>
      <div v-show="mostrarFiltros">
        <v-card-text>
          <v-row dense>
            <v-col cols="12" md="4">
              <PeriodoSelector />
            </v-col>
            <v-col cols="12" md="4">
              <TipoLiquidacionCombo />
            </v-col>
            <v-col cols="12" md="4">
              <GrupoReparticionCombo />
            </v-col>
          </v-row>
          <v-row class="mt-2" justify="end">
            <v-btn color="primary" @click="$emit('aplicar-filtros', consultaSeleccionada)">
              <v-icon left>mdi-filter-check</v-icon>
              Aplicar filtros
            </v-btn>
          </v-row>
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import { ComboPeriodo as PeriodoSelector, ComboTipoLiquidacion as TipoLiquidacionCombo, ComboGrupoReparticion as GrupoReparticionCombo } from '@/components/combos'
import { reportQueries } from '@/queries/reportQueries.js'
const consultas = Object.entries(reportQueries).map(([id, q]) => ({ id, ...q }))
const consultaSeleccionada = ref(consultas[0]?.id || '')
const mostrarFiltros = ref(true)
</script>

<style scoped>
.v-card {
  background: transparent;
  box-shadow: none;
}
</style>
