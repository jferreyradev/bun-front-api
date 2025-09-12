import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTipoLiquidacionStore = defineStore('tipoLiquidacion', () => {
  const tipoSeleccionado = ref('')
  function setTipoSeleccionado(valor) {
    tipoSeleccionado.value = valor
  }
  return { tipoSeleccionado, setTipoSeleccionado }
})
