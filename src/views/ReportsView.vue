

<template>
  <v-container fluid class="py-8">
    <v-row align-content="center" align="center" class="mb-2">
      <v-col cols="12" md="6">
        <v-btn icon @click="$router.back()" color="primary" class="mr-2">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <span class="text-h5 font-weight-bold">Reportes</span>
      </v-col>
    </v-row>
    <v-row align-content="center" align="center" class="mb-2">
      <v-col cols="12" md="8" lg="6">
        <v-card elevation="2" class="pa-4">
          <v-card-title class="text-h6 font-weight-bold">Filtros</v-card-title>
          <v-card-text>
            <PanelFiltrosReportes @aplicar-filtros="consultarReportes" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
</v-container>

  <v-container fluid class="pa-0">
    <v-row  align="center" class="mb-2">
      <v-col cols="12" md="10" lg="8">
        <v-card elevation="2" class="pa-4 mt-4">
          <v-card-title class="text-h6 font-weight-bold">Resultados</v-card-title>
          <v-card-text>
            <v-alert v-if="error" type="error" class="mb-2">{{ error }}</v-alert>
            <v-progress-circular v-if="loading" indeterminate color="primary" class="ma-4" />
            <OutputTable
              :headers="headers"
              :items="resultados"
              :loading="loading"
              no-data-text="No hay resultados para los filtros seleccionados."
              loading-text="Cargando..."
              height="auto"
              fixed-header
              :footer-props="{ 'items-per-page-options': [10, 20, 50, 100] }"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script setup>
import OutputTable from '@/components/OutputTable.vue'
import PanelFiltrosReportes from '@/components/PanelFiltrosReportes.vue'
import { reportQueries } from '@/queries/reportQueries.js'
import { storeToRefs } from 'pinia'
import { useTipoLiquidacionStore } from '@/stores/tipoLiquidacion.js'
import { useGrupoReparticionStore } from '@/stores/grupoReparticion.js'
import { usePeriodoStore } from '@/stores/periodo.js'
import { ref, computed } from 'vue'
import { useApiFetch } from '@/composables/useApiFetch.js'

const tipoLiquidacionStore = useTipoLiquidacionStore()
const { tipoSeleccionado } = storeToRefs(tipoLiquidacionStore)
const grupoReparticionStore = useGrupoReparticionStore()
const { grupoSeleccionado } = storeToRefs(grupoReparticionStore)
const periodoStore = usePeriodoStore()
const { periodo } = storeToRefs(periodoStore)

const resultados = ref([])
const headers = ref([])
const { loading, error, apiFetch } = useApiFetch()

const reportQueriesArray = Object.entries(reportQueries).map(([id, q]) => ({ id, ...q }))
const consultaSeleccionada = ref(reportQueriesArray[0]?.id || '')

async function consultarReportes(idConsulta) {
  if (idConsulta) consultaSeleccionada.value = idConsulta
  // Ejemplo de consulta dinámica, ajusta según tu modelo de datos
  // Construir la consulta SQL usando los filtros
  let periodoFiltro = periodo.value ? `to_Date('${periodo.value}','dd/mm/yyyy')` : null
  let tipoFiltro = tipoSeleccionado.value ? tipoSeleccionado.value : null
  let grupoFiltro = grupoSeleccionado.value && grupoSeleccionado.value !== -1 ? grupoSeleccionado.value : null

  // Buscar la consulta seleccionada
  const consulta = reportQueriesArray.find(q => q.id === consultaSeleccionada.value)
  let sqlBase = consulta ? consulta.sql : ''
  // Detectar nombres de columna según la consulta seleccionada
  let colPeriodo = consulta?.colPeriodo 
  let colTipo = consulta?.colTipo
  let colGrupo = consulta?.colGrupo

  let filtroPeriodo = (consulta?.filtros?.includes('periodo') && periodoFiltro) ? `\n  and ${colPeriodo} = ${periodoFiltro}` : ''
  let filtroTipo = (consulta?.filtros?.includes('tipo') && tipoFiltro) ? `\n  and ${colTipo} in (${tipoFiltro})` : ''
  let filtroGrupo = (consulta?.filtros?.includes('grupo') && grupoFiltro) ? `\n  and ${colGrupo} = ${grupoFiltro}` : ''
  let sql = sqlBase
    .replace('{{PERIODO}}', filtroPeriodo)
    .replace('{{TIPO}}', filtroTipo)
    .replace('{{GRUPO}}', filtroGrupo)

    console.log('Consulta SQL generada:', sql)
  try {
    const data = await apiFetch('/api/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer demo',
      },
      body: JSON.stringify({ query: sql }),
    })
    resultados.value = Array.isArray(data) ? data : (data?.rows || [])
    // Generar headers en el orden del SELECT
    if (resultados.value.length > 0 && consulta) {
      // Extraer campos del SELECT
      const selectMatch = consulta.sql.match(/select([\s\S]*?)from/i)
      let selectFields = []
      if (selectMatch && selectMatch[1]) {
        selectFields = selectMatch[1]
          .split(',')
          .map(f => f.trim())
          .filter(f => f.length > 0)
      }
      // Mapear los campos a las claves reales del objeto resultado
      const row = resultados.value[0]
      headers.value = selectFields.map(f => {
        // Buscar alias (as ...)
        const aliasMatch = f.match(/as\s+(\w+)$/i)
        let key = aliasMatch ? aliasMatch[1] : f.split('.').pop()
        // Si la clave no existe, buscar la que más se le parezca (por si el backend cambia mayúsculas/minúsculas)
        if (row && !(key in row)) {
          const found = Object.keys(row).find(k => k.toLowerCase() === key.toLowerCase())
          if (found) key = found
        }
        return { text: key, value: key, title: key }
      })
    } else {
      headers.value = []
    }
  } catch (e) {
    resultados.value = []
    headers.value = []
  }
}
</script>
