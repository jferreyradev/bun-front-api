<template>
  <div>
    <BtnBack />
    <h2>Procedimientos almacenados</h2>
    <p>Invoca procedimientos almacenados de la base de datos con parámetros.</p>
    <v-container class="py-4">
      <v-text-field v-model="procName" label="Nombre del procedimiento" class="mb-2" />
      <v-text-field v-model="procParams" label="Parámetros (separados por coma)" class="mb-2" />
      <v-btn color="primary" :loading="procLoading" @click="llamarProcedimiento">Ejecutar</v-btn>
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

const procName = ref('')
const procParams = ref('')
const { loading: procLoading, error: procError, result: procResult, apiFetch } = useApiFetch()

async function llamarProcedimiento() {
  console.log(procParams.value.split(',').map((p) => p.trim()))
  procResult.value = ''
  try {
    const data = await apiFetch('/procedure', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer demo',
      },
      body: JSON.stringify({
        name: procName.value,
        params: procParams.value.split(',').map((p) => p.trim()),
      }),
    })
    procResult.value = typeof data === 'object' ? JSON.stringify(data) : String(data)
  } catch (e) {
    procResult.value = 'Error: ' + e.message
  }
}
</script>
