
<template>
  <div>
    <BtnBack />
    <h2>Reportes</h2>
    <p>Aquí puedes visualizar y descargar reportes.</p>

  <PanelFiltrosReportes />
  <div class="mt-4">
    <b>Periodo seleccionado:</b> {{ periodo || 'No seleccionado' }}<br>
    <b>Tipo de liquidación:</b> {{ tipoSeleccionado || 'No seleccionado' }}<br>
    <b>Grupo de repartición:</b> {{ grupoSeleccionado || 'No seleccionado' }}
  </div>

  </div>
</template>


<script setup>
import BtnBack from '@/components/BtnBack.vue'
import PanelFiltrosReportes from '@/components/PanelFiltrosReportes.vue'
import { storeToRefs } from 'pinia'
import { useTipoLiquidacionStore } from '@/stores/tipoLiquidacion.js'
import { useGrupoReparticionStore } from '@/stores/grupoReparticion.js'
import { usePeriodoStore } from '@/stores/periodo.js'

const tipoLiquidacionStore = useTipoLiquidacionStore()
const { tipoSeleccionado } = storeToRefs(tipoLiquidacionStore)
const grupoReparticionStore = useGrupoReparticionStore()
const { grupoSeleccionado } = storeToRefs(grupoReparticionStore)
const periodoStore = usePeriodoStore()
const { periodo } = storeToRefs(periodoStore)
</script>
