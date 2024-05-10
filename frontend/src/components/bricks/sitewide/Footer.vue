
<template>


            <component :is="components[`${site}${thisPageComponentName}`]"></component>

    </template>
    
    <script>
    import { ref, onMounted } from 'vue'
    import components from './FooterComponents.ts'
    
    export default {
      props: {
        thisPageComponentName: String,

      },
      setup(props) {
        const loadedComponents = ref({})
        const site = window.location.hostname
    
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
          site,
          thisPageComponentName: props.thisPageComponentName,

        }
      }
    }
    </script>
    