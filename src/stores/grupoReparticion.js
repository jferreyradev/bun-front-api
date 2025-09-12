import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGrupoReparticionStore = defineStore('grupoReparticion', () => {
  const grupoSeleccionado = ref('')
  function setGrupoSeleccionado(valor) {
    grupoSeleccionado.value = valor
  }
  return { grupoSeleccionado, setGrupoSeleccionado }
})
