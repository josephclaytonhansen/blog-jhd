
<template>


            <component :is="components[`${site}${thisPageComponentName}`]"></component>

    </template>
    
    <script>
    import { ref, onMounted, watch } from 'vue'
    import components from './HeaderComponents.ts'
    
    export default {
      props: {
        thisPageComponentName: String,
      },
      setup(props) {
        const loadedComponents = ref({})
        const site = window.location.hostname
    
        const loadComponents = async () => {
          const componentPromises = Object.keys(components).map(async (componentName) => {
            try {
              // Wait for the component to be imported
              let component = await components[componentName]
              console.log(componentName)

              // Use the component
              loadedComponents.value[componentName] = component.default
              console.log(Object.keys(components))
              console.log(components[`${site}${props.thisPageComponentName}`])
            } catch (error) {
              console.error(`Failed to load component ${componentName}: ${error}`)
            }
          })

          await Promise.all(componentPromises)
        }
    
        watch(() => props.thisPageComponentName, loadComponents, { immediate: true })
    
        return {
          components: loadedComponents,
          site,
          thisPageComponentName: props.thisPageComponentName,
        }
      },
    }
    </script>
    