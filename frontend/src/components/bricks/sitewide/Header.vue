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
  console.log(Object.keys(components))
  console.log(components[`${site}${props.thisPageComponentName}`])
})

</script>

<template>
  <h1>Render test {{ site }}{{ props.thisPageComponentName }}</h1>
  <component :is="components[`${site}${props.thisPageComponentName}`]"></component>
</template>