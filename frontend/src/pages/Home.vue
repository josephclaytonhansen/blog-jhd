<script>
import { ref, onMounted } from 'vue'
import components from './HomeComponents.ts'

export default {
  props: {
    thisPageComponentName: String
  },
  components: {}, // Register components locally
  setup(props) {
    const loadedComponents = ref({})
    const site = window.location.hostname
    console.log(site, props.thisPageComponentName)

    onMounted(async () => {
      for (let componentName in components) {
        // Wait for the component to be imported
        let component = await components[componentName]

        // Use the component
        loadedComponents.value[componentName] = component.default

        // Register the component locally
        this.components[componentName] = component.default
      }
      console.log(Object.keys(components))
      console.log(components[`${site}${props.thisPageComponentName}`])
    })

    return {
      components: loadedComponents,
      site,
      thisPageComponentName: props.thisPageComponentName
    }
  }
}
</script>

<template>
  <Header />
  <div>
    <component :is="`${site}${thisPageComponentName}`"></component>
  </div>
</template>