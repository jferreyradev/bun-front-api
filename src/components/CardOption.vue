<template>
  <v-col :cols="cols" :md="md">
    <v-card :color="color" class="mb-4">
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>
        <slot name="text">
          <div>{{ description }}</div>
        </slot>
      </v-card-text>
      <v-card-actions>
        <slot name="actions">
          <v-btn :color="btnColor" variant="flat" @click="$emit('action')">{{ btnText }}</v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script setup>
const props = defineProps({
  title: String,
  description: String,
  color: {
    type: String,
    default: 'primary',
  },
  btnText: {
    type: String,
    default: 'Acción',
  },
  btnColor: {
    type: String,
    default: 'primary',
  },
  cols: {
    type: [String, Number],
    default: 12,
  },
  md: {
    type: [String, Number],
    default: 4,
  },
})
</script>
