<script setup>
import { useApiFetch } from '@/composables/useApiFetch.js'
import { usePeriodoStore } from '@/stores/periodo.js'
import { ComboPeriodo as PeriodoSelector } from '@/components/combos'
import { storeToRefs } from 'pinia'
// Estado global periodo
const periodoStore = usePeriodoStore()
const { periodo } = storeToRefs(periodoStore)
function actualizarPeriodo(nuevoPeriodo) {
  periodoStore.setPeriodo(nuevoPeriodo)
}
// Verificación de conexión
const {
  loading: pingLoading,
  error: pingError,
  result: pingResult,
  apiFetch: apiPing,
} = useApiFetch()
async function verificarConexion() {
  try {
    await apiPing('/api/ping', {
      headers: { Authorization: 'Bearer demo' },
    })
    mostrarResultado.value = true
  } catch {}
}
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import OutputJson from '@/components/OutputJson.vue'
import CardOption from '@/components/CardOption.vue'
const router = useRouter()
// SQL libre
const sqlDialog = ref(false)
const sqlQuery = ref('')
const { loading: sqlLoading, error: sqlError, result: sqlResult, apiFetch: apiSql } = useApiFetch()
async function ejecutarConsulta() {
  try {
    const data = await apiSql('/api/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer demo',
      },
      body: JSON.stringify({ query: sqlQuery.value }),
    })
    // Si quieres formatear el resultado como string:
    if (typeof data === 'object') sqlResult.value = JSON.stringify(data)
    else sqlResult.value = String(data)
  } catch (e) {
    sqlResult.value = 'Error: ' + e.message
  }
}

// Procedimiento almacenado
const procDialog = ref(false)
const procName = ref('')
const procParams = ref('')
const {
  loading: procLoading,
  error: procError,
  result: procResult,
  apiFetch: apiProc,
} = useApiFetch()

const mostrarResultado = ref(false)

async function llamarProcedimiento() {
  try {
    const data = await apiProc('/procedure', {
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
    if (typeof data === 'object') procResult.value = JSON.stringify(data)
    else procResult.value = String(data)
    mostrarResultado.value = true
  } catch (e) {
    procResult.value = 'Error: ' + e.message
  }
}
function cerrarResultado() {
  mostrarResultado.value = false
  sqlResult.value = ''
}
</script>

<template>
  <v-container class="py-8">
    <v-row class="mb-4">
      <v-col cols="12" md="4">
        <PeriodoSelector :model-value="periodo" @update:periodo="actualizarPeriodo" />
        <div class="mt-2">Periodo seleccionado: <b>{{ periodo || 'No seleccionado' }}</b></div>
      </v-col>
    </v-row>
    <v-row class="mb-4">
      <CardOption
        title="Verificar conexión API"
        description="Comprueba si el backend está disponible y responde correctamente."
        color="grey-lighten-3"
        btnText="Verificar conexión"
        btnColor="info"
        @action="verificarConexion"
        :cols="12"
        :md="12"
      >
        <template #actions>
          <v-btn color="info" :loading="pingLoading" @click="verificarConexion"
            >Verificar conexión API</v-btn
          >
        </template>
        <template #text>
          <div>Comprueba si el backend está disponible y responde correctamente.</div>
          <OutputJson
            v-if="mostrarResultado"
            :json="pingResult"
            title="Respuesta de la API"
            @close="cerrarResultado"
          />
        </template>
      </CardOption>
    </v-row>
    <v-row>
      <CardOption
        title="Usuarios"
        description="Gestión de usuarios del sistema."
        color="blue-lighten-5"
        btnText="Ver usuarios"
        btnColor="primary"
        @action="() => router.push('/users')"
      />
      <CardOption
        title="Reportes"
        description="Visualiza y descarga reportes."
        color="green-lighten-5"
        btnText="Ver reportes"
        btnColor="success"
        @action="() => router.push('/reports')"
      />
      <CardOption
        title="Configuración"
        description="Ajustes generales del sistema."
        color="red-lighten-5"
        btnText="Configurar"
        btnColor="error"
        @action="() => router.push('/config')"
      />
      <CardOption
        title="Consultas SQL libres"
        description="Ejecuta consultas SQL personalizadas directamente sobre la base de datos."
        color="purple-lighten-5"
        btnText="Ir a consultas SQL"
        btnColor="purple"
        @action="() => router.push('/sql')"
        :cols="12"
        :md="6"
      />
      <CardOption
        title="Llamar procedimientos almacenados"
        description="Invoca procedimientos almacenados de la base de datos con parámetros."
        color="orange-lighten-5"
        btnText="Ir a procedimientos"
        btnColor="orange"
        @action="() => router.push('/procedures')"
        :cols="12"
        :md="6"
      />
      <v-dialog v-model="sqlDialog" max-width="600">
        <v-card>
          <v-card-title>Consulta SQL libre</v-card-title>
          <v-card-text>
            <v-textarea v-model="sqlQuery" label="Consulta SQL" rows="4" auto-grow></v-textarea>
            <OutputJson
              v-if="sqlResult"
              :json="sqlResult"
              title="Resultado SQL"
              @close="sqlResult = ''"
            />
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" :loading="sqlLoading" @click="ejecutarConsulta">Ejecutar</v-btn>
            <v-btn text @click="sqlDialog = false">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>
