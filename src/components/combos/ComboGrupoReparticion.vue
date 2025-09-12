<template>
  <div class="gruporeparticion-combo">
    <v-select
      v-model="selected"
      :items="items"
      item-value="id"
      item-title="nombre"
      label="Grupo de Repartición"
      dense
      outlined
      hide-details
      :disabled="items.length === 0"
      class="combo-select"
    />
  </div>
</template>

<script setup>

import { ref, onMounted, watch } from 'vue'
import { useApiFetch } from '@/composables/useApiFetch.js'
import { useGrupoReparticionStore } from '@/stores/grupoReparticion.js'
import { storeToRefs } from 'pinia'

const grupoReparticionStore = useGrupoReparticionStore()
const { grupoSeleccionado } = storeToRefs(grupoReparticionStore)
const selected = grupoSeleccionado
const items = ref([])
const { result, apiFetch } = useApiFetch()

onMounted(async () => {
  await ejecutarConsulta()
  let raw = []
  if (Array.isArray(result.value)) {
    raw = result.value
  } else if (result.value && result.value.rows) {
    raw = result.value.rows
  }
  items.value = raw.map(item => {
    const claves = Object.keys(item)
    const idKey = claves.find(k => k.toLowerCase().includes('id')) || claves[0]
    const nombreKey = claves.find(k => k.toLowerCase().includes('nombre') || k.toLowerCase().includes('desc')) || claves[1] || claves[0]
    return {
      id: item[idKey],
      nombre: item[nombreKey]
    }
  })
})

async function ejecutarConsulta() {
  try {
    const data = await apiFetch('/api/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer demo',
      },
      body: JSON.stringify({ query: 'SELECT * FROM usuario.gruposreparticion order by 1' }),
    })
    items.value = data
  } catch (e) {
    items.value = []
  }
}
</script>

<style scoped>
.gruporeparticion-combo {
  max-width: 320px;
}
</style>
