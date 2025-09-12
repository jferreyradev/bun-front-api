import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePeriodoStore = defineStore('periodo', () => {
  const periodo = ref('') // formato: 'YYYY-MM'
  const periodoActivo = ref('') // formato: 'YYYY-MM'
  function setPeriodo(nuevoPeriodo) {
    periodo.value = nuevoPeriodo
  }
  function setPeriodoActivo(nuevoPeriodoActivo) {
    periodoActivo.value = nuevoPeriodoActivo
  }
  return { periodo, setPeriodo, periodoActivo, setPeriodoActivo }
})
