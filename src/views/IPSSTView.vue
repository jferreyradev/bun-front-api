<template>
  <div>
    <BtnBack />
    <h2>IPSST</h2>    
    <p>Esta es la vista de IPSST.</p>
    <p> </p>

     <v-col cols="12" md="4">
        <PeriodoSelector />
        <v-row class="mt-2" justify="end">
          <v-btn color="primary" @click="ejecutarConsulta">IPSST_CARGA</v-btn>
          <v-btn color="secondary" class="ml-2" @click="ejecutarProcedimiento">Registrar Liquidación</v-btn>
        </v-row>
     </v-col>

    <v-col cols="12">
       <OutputTable 
       :headers="tableHeaders" 
       :items="tableItems" 
       :loading="loading" 
        height="auto"
       />
     </v-col> 
    
  </div>
</template>

<script setup>  

import BtnBack from '@/components/BtnBack.vue'
import { ComboPeriodo as PeriodoSelector } from '@/components/combos'
import OutputTable from '@/components/OutputTable.vue'
import { usePeriodoStore } from '@/stores/periodo.js'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useApiFetch } from '@/composables/useApiFetch.js'

const { periodo } = storeToRefs(usePeriodoStore())
const { apiFetch } = useApiFetch()

const tableHeaders = ref([])
const tableItems = ref([])
const loading = ref(false)
const resultados= ref([])





async function ejecutarConsulta() {
  loading.value = true
  try {
    const periodoVal = periodo.value ? `to_Date('${periodo.value}','dd/mm/yyyy')` : null
    //periodo.value
    const sql = `SELECT c.IDIPSSTCARGA, c.IDTIPOLIQUIDACION,c.IDGRUPO,c.FECHAEMISION,c.IDREP,
     c.ESTADO,c.PERIODO
FROM USUARIO.IPSST_CARGA c
WHERE c.PERIODO = ${periodoVal}`

console.log('Consulta SQL:', sql)

    const data = await apiFetch('/api/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer demo',
      },
      body: JSON.stringify({ query: sql }),
    })

     resultados.value = Array.isArray(data) ? data : (data?.rows || [])
     console.log('Respuesta de la consulta:', JSON.stringify(resultados.value, null, 2))

    tableItems.value = Array.isArray(data) ? data : []
    // Generar headers dinámicamente según las claves del primer resultado
    if (tableItems.value.length > 0) {
      tableHeaders.value = Object.keys(tableItems.value[0]).map(key => ({ text: key, value: key, title: key }))
      console.log('Headers de la tabla:', tableHeaders.value)
    } else {
      tableHeaders.value = []
      console.log('Headers de la tabla: []')
    }
    
  } catch (e) {
    tableItems.value = []
  } finally {
    loading.value = false
  }
}


// Llamar procedimiento USUARIO.IPSST_REGISTRALIQ
async function ejecutarProcedimiento() {
  try {
    const periodoVal = periodo.value ? `to_Date('${periodo.value}','dd/mm/yyyy')` : null
    const sql = `CALL USUARIO.MOD_PROC_IPSST.IPSST_REGISTRALIQ(${periodoVal})`
    console.log('Ejecutando procedimiento:', sql);
    const data = await apiFetch('/api/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer demo',
      },
      body: JSON.stringify({ query: sql }),
    });
    console.log('Resultado procedimiento:', data);
  } catch (e) {
    console.error('Error al ejecutar procedimiento:', e);
  }
}

</script>