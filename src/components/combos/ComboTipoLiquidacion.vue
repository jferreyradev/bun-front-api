<template>
  <div class="tipo-liquidacion-combo">
      <v-select
        v-model="selected"
        :items="items"
        item-value="IDTIPOLIQUIDACION"
        item-title="DESCRIPCION"
        label="Tipo de Liquidación"
        dense
        outlined
        hide-details
        :disabled="items.length === 0"
        class="combo-select"
      />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApiFetch } from '@/composables/useApiFetch.js'
import { useTipoLiquidacionStore } from '@/stores/tipoLiquidacion.js'
import { storeToRefs } from 'pinia'

const tipoLiquidacionStore = useTipoLiquidacionStore()
const { tipoSeleccionado } = storeToRefs(tipoLiquidacionStore)

const selected = tipoSeleccionado

const items = ref([])
const { result, apiFetch, loading } = useApiFetch()

onMounted(async () => {
  await ejecutarConsulta()
  let raw = []
  if (Array.isArray(result.value)) {
    raw = result.value
  } else if (result.value && result.value.rows) {
    raw = result.value.rows
  }
})

async function ejecutarConsulta() {  
  try {
    const data = await apiFetch('/api/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer demo',
      },
      body: JSON.stringify({ query: 'SELECT * FROM usuario.tabtipoliquidacion order by 1' }),
    })
    items.value = data
  } catch (e) {
    items.value = []
  }
}
</script>

<style scoped>
.tipo-liquidacion-combo {
  max-width: 320px;
}
</style>
