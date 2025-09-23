
<template>
  <div>
    <div class="export-bar" style="margin-bottom: 12px;">
      <v-btn size="small" color="primary" @click="exportCsv">
        <v-icon start>mdi-file-delimited</v-icon> CSV
      </v-btn>
      <v-btn size="small" color="success" @click="exportXls">
        <v-icon start>mdi-file-excel</v-icon> Excel
      </v-btn>
      <v-btn size="small" color="info" @click="exportJson">
        <v-icon start>mdi-code-json</v-icon> JSON
      </v-btn>
    </div>
    <v-data-table
      :headers="computedHeaders"
      :items="items"
      class="elevation-1"
      density="compact"
      :items-per-page="10"
      :loading="loading"
      :no-data-text="noDataText"
      :loading-text="loadingText"
      :height="height"
      :fixed-header="fixedHeader"
      :footer-props="footerProps"
    >
    </v-data-table>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'
import { exportCSV, exportExcel, exportJSON } from '@/utils/exportTable.js'
const props = defineProps({
  headers: { type: Array, required: true },
  items: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  noDataText: { type: String, default: 'No hay resultados para los filtros seleccionados.' },
  loadingText: { type: String, default: 'Cargando...' },
  height: { type: [String, Number], default: undefined },
  fixedHeader: { type: Boolean, default: false },
  footerProps: { type: Object, default: () => ({}) }
})

function prettifyHeader(str) {
  return str
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase())
}

const computedHeaders = computed(() =>
  props.headers.map(h => ({
    ...h,
    text: prettifyHeader(h.text)
  }))
)

function exportCsv() {
  exportCSV(props.headers.map(h => h.value), props.items)
}
function exportXls() {
  exportExcel(props.headers.map(h => h.value), props.items)
}
function exportJson() {
  exportJSON(props.items)
}
</script>

<style scoped>
.header-cell {
  font-weight: bold;
  background: #f5f5f5;
  color: #1976d2;
  border-bottom: 2px solid #1976d2;
  text-align: left;
  padding: 8px 12px;
}

.export-bar {
  display: flex;
  gap: 8px;
}
</style>
