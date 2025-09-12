<template>
  <div class="filtros-panel">
    <PeriodoSelector />
    <TipoLiquidacionCombo />
    <GrupoReparticionCombo />
  </div>
</template>

<script setup>
import { ComboPeriodo as PeriodoSelector, ComboTipoLiquidacion as TipoLiquidacionCombo, ComboGrupoReparticion as GrupoReparticionCombo } from '@/components/combos'
</script>

<style scoped>
.filtros-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end;
  margin-bottom: 24px;
}
</style>
