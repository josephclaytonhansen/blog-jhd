<script setup>
import { ref, onMounted } from 'vue'
import components from './HeaderComponents.ts'

const props = defineProps({
  thisPageComponentName: String,
  header: Boolean,
  footer: Boolean
})

const loadedComponents = ref({})
const site = window.location.hostname

onMounted(async () => {
  console.log(site, props.thisPageComponentName, components)
  for (let componentName in components) {
    // Wait for the component to be imported
    let component = await components[componentName]

    // Use the component
    loadedComponents.value[componentName] = component.default
  }
})

</script>

<template>
  <component :is="loadedComponents[`${site}${props.thisPageComponentName}`]"></component>
</template>