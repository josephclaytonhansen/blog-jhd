
<template>
    <Header />
    <div>
        <component :is="components[`${site}_${thisPageComponentName}`]"></component>
    </div>
    <Footer />
</template>

<script>
import { ref, onMounted } from 'vue'
import components from './NotFoundComponents.ts'

export default {
  props: {
    thisPageComponentName: String
  },
  setup(props) {
    const loadedComponents = ref({})

    onMounted(async () => {
      for (let componentName in components) {
        // Wait for the component to be imported
        let component = await components[componentName]

        // Use the component
        loadedComponents.value[componentName] = component.default
      }
    })

    return {
      components: loadedComponents,
      site: window.location.hostname.split('.')[0]
    }
  }
}
</script>
