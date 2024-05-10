
<template>


            <component :is="components[`${site}${thisPageComponentName}`]"></component>

    </template>
    
    <script>
    import { ref, onMounted, watch } from 'vue'
    import components from './FooterComponents.ts'
    
    export default {
      props: {
        thisPageComponentName: String,
      },
      setup(props) {
        const loadedComponents = ref({})
        const site = window.location.hostname
    
        const loadComponents = async () => {
          const componentPromises = Object.entries(components).map(async ([componentName, componentPromise]) => {
            try {
              let component = await componentPromise
              console.log(componentName)
    
              loadedComponents.value[componentName] = component.default
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