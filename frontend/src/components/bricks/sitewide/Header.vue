
<template>
  <component :is="loadedComponents[`${site}${thisPageComponentName}`]" v-if="loadedComponents[`${site}${thisPageComponentName}`]"></component>
</template>
    
    <script>
import { ref, onMounted, watch, toRef } from 'vue'

export default {
  props: {
    thisPageComponentName: String,
  },
  async setup(props) {
  const loadedComponents = ref({});
  const site = window.location.hostname;

  const { default: componentsPromise } = await import('./HeaderComponents.ts');
  const components = await componentsPromise;

  for (const [componentName, component] of Object.entries(components)) {
    loadedComponents.value[componentName] = component;
  }

  return {
    loadedComponents,
    site: ref(site),
    thisPageComponentName: toRef(props, 'thisPageComponentName'),
  }
}
}
</script>