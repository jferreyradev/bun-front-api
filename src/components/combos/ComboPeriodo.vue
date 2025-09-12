<template>
  <div class="periodo-selector">
    <label>Periodo (Mes/Año):</label>
    <select v-model="mes" @change="emitirPeriodo" class="periodo-combo">
      <option v-for="m in meses" :key="m.value" :value="m.value">{{ m.text }}</option>
    </select>
    <select v-model="anio" @change="emitirPeriodo" class="periodo-combo">
      <option v-for="a in anios" :key="a" :value="a">{{ a }}</option>
    </select>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { usePeriodoStore } from '@/stores/periodo.js'
import { storeToRefs } from 'pinia'

const periodoStore = usePeriodoStore()
const { periodo, periodoActivo } = storeToRefs(periodoStore)

const meses = [
  { value: '01', text: 'Enero' },
  { value: '02', text: 'Febrero' },
  { value: '03', text: 'Marzo' },
  { value: '04', text: 'Abril' },
  { value: '05', text: 'Mayo' },
  { value: '06', text: 'Junio' },
  { value: '07', text: 'Julio' },
  { value: '08', text: 'Agosto' },
  { value: '09', text: 'Septiembre' },
  { value: '10', text: 'Octubre' },
  { value: '11', text: 'Noviembre' },
  { value: '12', text: 'Diciembre' },
]
const anioActual = new Date().getFullYear()
const anios = Array.from({ length: 10 }, (_, i) => String(anioActual - 5 + i))

import { onMounted } from 'vue'
import { useApiFetch } from '@/composables/useApiFetch.js'

const mes = ref('01')
const anio = ref(String(anioActual))

watch([anio, mes], () => {
  // Guardar en formato dd/mm/yyyy (siempre día 01)
  periodo.value = `01/${mes.value}/${anio.value}`
  console.log('Periodo actualizado desde selector:', periodo.value)
  console.log('Periodo activo actual:', periodoActivo.value)
})

const { apiFetch } = useApiFetch()

onMounted(async () => {
  try {
    const data = await apiFetch('/api/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer demo',
      },
      body: JSON.stringify({ query: 'SELECT * FROM usuario.periodo where activo = 1' }),
    })
    console.log('Periodo activo desde API:', data[0].PERIODO)

    // Suponiendo que data es un array y el periodo está en data[0]
    if (Array.isArray(data) && data.length > 0) {
      // Ajusta el nombre de la propiedad según la respuesta real de tu API
      const fechaIso = data[0].FECHA || data[0].PERIODO || data[0].periodo
      if (fechaIso) {
        const fecha = new Date(fechaIso)
        mes.value = String(fecha.getMonth() + 1).padStart(2, '0')
        anio.value = String(fecha.getFullYear())
        periodo.value = `01/${mes.value}/${anio.value}`
        periodoStore.setPeriodoActivo(`01/${mes.value}/${anio.value}`)
        console.log('Periodo formateado:', periodo.value)
      }
    }

  } catch (e) {
    // No hacer nada, dejar valores por defecto
  }
})
</script>

<style scoped>
.periodo-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}
.periodo-combo {
  padding: 4px 8px;
  font-size: 1rem;
}
</style>
