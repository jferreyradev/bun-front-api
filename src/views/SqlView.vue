<template>
  <div class="sql-view-center">
    <BtnBack />
    <h2>Consultas SQL libres</h2>
    <p>Ejecuta consultas SQL personalizadas directamente sobre la base de datos.</p>
    <div class="sql-input-wrapper">
      <v-textarea
        v-model="sqlQuery"
        label="Consulta SQL"
        rows="4"
        auto-grow
        class="mb-2 sql-textarea"
      />
      <v-btn color="primary" :loading="sqlLoading" @click="ejecutarConsulta"
        >Ejecutar consulta</v-btn
      >
    </div>
    <OutputJson
      v-if="mostrarResultado"
      :json="sqlResult"
      title="Resultado SQL"
      class="mt-4"
      @close="cerrarResultado"
    />
  </div>
</template>

<script setup>
import BtnBack from '@/components/BtnBack.vue'
import OutputJson from '@/components/OutputJson.vue'

import { ref } from 'vue'
import { useApiFetch } from '@/composables/useApiFetch.js'

const sqlQuery = ref('')
const mostrarResultado = ref(false)
const { loading: sqlLoading, error: sqlError, result: sqlResult, apiFetch } = useApiFetch()

async function ejecutarConsulta() {
  mostrarResultado.value = false
  try {
    const data = await apiFetch('/api/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer demo',
      },
      body: JSON.stringify({ query: sqlQuery.value }),
    })
    if (typeof data === 'object') sqlResult.value = JSON.stringify(data)
    else sqlResult.value = String(data)
    mostrarResultado.value = true
  } catch (e) {
    sqlResult.value = 'Error: ' + e.message
    mostrarResultado.value = true
  }
}

function cerrarResultado() {
  mostrarResultado.value = false
  sqlResult.value = ''
}
</script>
<style scoped>
.sql-view-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
.sql-input-wrapper {
  width: 100%;
  max-width: 600px;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
}
.sql-textarea {
  width: 100%;
  min-width: 320px;
  max-width: 600px;
}
</style>
