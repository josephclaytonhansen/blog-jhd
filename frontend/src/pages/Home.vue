<script>
import { ref, onMounted } from 'vue'
import components from './HomeComponents.ts'

export default {
  props: {
    thisPageComponentName: String,
    header: {type: Boolean, default: true},
    footer: {type: Boolean, default: true}
  },
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
  <div>
    <component :is="components[`${site}${thisPageComponentName}`]"></component>
</div>
</template>