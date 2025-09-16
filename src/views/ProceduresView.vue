<template>
  <div>
    <BtnBack />
    <h2>Procedimientos almacenados</h2>
    <p>Invoca procedimientos almacenados de la base de datos con parámetros.</p>
    <v-container class="py-4">
      <v-textarea
        v-model="procJson"
        label="JSON de ejecución de procedimiento"
        class="mb-2"
        rows="8"
        auto-grow
      />
      <v-btn color="primary" :loading="procLoading" @click="ejecutarJson">Ejecutar JSON</v-btn>
      <OutputJson
        v-if="procResult"
        :json="procResult"
        title="Resultado"
        @close="procResult = ''"
        class="mt-4"
      />
      <v-alert v-if="procError" type="error" class="mt-2">{{ procError }}</v-alert>
    </v-container>
  </div>
</template>

<script setup>
import BtnBack from '@/components/BtnBack.vue'
import OutputJson from '@/components/OutputJson.vue'
import { ref } from 'vue'
import { useApiFetch } from '@/composables/useApiFetch.js'

const procJson = ref('')
const { loading: procLoading, error: procError, result: procResult, apiFetch } = useApiFetch()


async function ejecutarJson() {
  procResult.value = ''
  try {
    let parsed = JSON.parse(procJson.value)
    const data = await apiFetch('/api/procedure', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer demo',
      },
      body: JSON.stringify(parsed),
    })
    procResult.value = typeof data === 'object' ? JSON.stringify(data) : String(data)
  } catch (e) {
    procResult.value = 'Error: ' + (e?.message || e)
  }
}
</script>
