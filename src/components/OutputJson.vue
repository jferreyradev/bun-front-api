<template>
  <v-card class="pa-3 mb-2 output-json-card" v-if="json">
    <v-card-title v-if="title" class="d-flex align-center justify-space-between">
      <span>{{ title }}</span>
      <div>
        <v-btn
          size="small"
          icon="mdi-content-copy"
          variant="text"
          @click="copiarJson"
          :title="copied ? 'Copiado!' : 'Copiar'"
        >
          <v-icon>{{ copied ? 'mdi-check' : 'mdi-content-copy' }}</v-icon>
        </v-btn>
        <v-btn
          size="small"
          icon="mdi-download"
          variant="text"
          @click="descargarJson"
          title="Descargar JSON"
        >
          <v-icon>mdi-download</v-icon>
        </v-btn>
        <v-btn size="small" icon="mdi-close" variant="text" @click="$emit('close')" title="Cerrar">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
    </v-card-title>
    <v-card-text>
      <pre class="output-json-pre">{{ formattedJson }}</pre>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref as vueRef, computed } from 'vue'
const copied = vueRef(false)

async function copiarJson() {
  try {
    await navigator.clipboard.writeText(formattedJson.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 1200)
  } catch {}
}

function descargarJson() {
  const blob = new Blob([formattedJson.value], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = (props.title || 'output') + '.json'
  document.body.appendChild(a)
  a.click()
  setTimeout(() => {
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 100)
}

const props = defineProps({
  json: {
    type: [Object, Array, String],
    default: null,
  },
  title: {
    type: String,
    default: '',
  },
})

const formattedJson = computed(() => {
  if (!props.json) return ''
  if (typeof props.json === 'string') {
    try {
      return JSON.stringify(JSON.parse(props.json), null, 2)
    } catch {
      return props.json
    }
  }
  return JSON.stringify(props.json, null, 2)
})
</script>

<style scoped>
.d-flex {
  display: flex;
}
.align-center {
  align-items: center;
}
.justify-space-between {
  justify-content: space-between;
}
.output-json-card {
  max-width: 600px;
  min-width: 320px;
  max-height: 320px;
  min-height: 120px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}
.output-json-pre {
  font-size: 0.95em;
  line-height: 1.4;
  margin: 0;
  background: #222;
  color: #fff;
  padding: 1em;
  border-radius: 8px;
  max-height: 200px;
  overflow: auto;
  white-space: pre;
}
</style>
