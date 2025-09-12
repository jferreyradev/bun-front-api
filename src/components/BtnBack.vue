<template>
  <v-btn color="primary" variant="text" @click="volver">
    <v-icon start>mdi-arrow-left</v-icon>
    Volver
  </v-btn>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
function volver() {
  router.back()
}
</script>
