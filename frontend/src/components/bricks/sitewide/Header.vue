
<template>


<component :is="components[`${site}${thisPageComponentName}`]" v-if="components[`${site}${thisPageComponentName}`]"></component>

    </template>
    
    <script>
import { ref, onMounted, watch, toRef } from 'vue'

export default {
  props: {
    thisPageComponentName: String,
  },
  async setup(props) {
    const loadedComponents = {}
    const site = window.location.hostname

    const components = await import('./HeaderComponents.ts')

    const loadComponents = async () => {
      const componentPromises = Object.entries(components).map(([componentName, component]) => {
        console.log(componentName)
        loadedComponents[componentName] = ref(component)
      })

      await Promise.all(componentPromises)
    }

    onMounted(loadComponents)

    return {
      ...toRefs(loadedComponents),
      site: ref(site),
      thisPageComponentName: toRef(props, 'thisPageComponentName'),
    }
  }
}
</script>