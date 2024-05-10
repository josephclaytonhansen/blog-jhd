<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  thisPageComponentName: String,
})

const thisPageComponentName = ref('')
const loadedComponents = ref({})
const site = window.location.hostname

const { default: componentsPromise } = await import('./HeaderComponents.ts')
const components = await componentsPromise

for (const [componentName, component] of Object.entries(components)) {
  loadedComponents.value[componentName] = component
}

console.log(loadedComponents)

watch(() => props.thisPageComponentName, (newVal) => {
  thisPageComponentName.value = newVal
}, { immediate: true })
</script>

<template>
  <h1>Render test</h1>

</template>