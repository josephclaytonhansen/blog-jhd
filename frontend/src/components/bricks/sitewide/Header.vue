<script>
import { ref, onMounted } from 'vue'
import components from './HeaderComponents.ts'
export default {
  props: {
    thisPageComponentName: String,
    header: Boolean,
    footer: Boolean
  },
  setup(props) {
    const loadedComponents = ref({})
    const site = window.location.hostname
    

    onMounted(async () => {
      console.log(site, props.thisPageComponentName)
      for (let componentName in components) {
        // Wait for the component to be imported
        let component = await components[componentName]

        // Use the component
        loadedComponents.value[componentName] = component.default
      }
      console.log(Object.keys(components))
      console.log(components[`${site}${props.thisPageComponentName}`])
    })

    return {
      components: loadedComponents,
      site,
      thisPageComponentName: props.thisPageComponentName,
      header: props.header,
      footer: props.footer
    }
  }
}

</script>

<template>
  <h1>Render test {{ site }} {{ thisPageComponentName }}</h1>
  <component :is="components[`${site}${thisPageComponentName}`]"></component>

</template>