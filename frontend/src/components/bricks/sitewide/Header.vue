
<template>


<component :is="components[`${site}${thisPageComponentName}`]" v-if="components[`${site}${thisPageComponentName}`]"></component>

    </template>
    
    <script>
    import { ref, onMounted, watch, toRef } from 'vue'
    import components from './HeaderComponents.ts'
    
    export default {
      props: {
        thisPageComponentName: String,
      },
      setup(props) {
      const loadedComponents = {}
      const site = window.location.hostname

      const loadComponents = async () => {
        const componentPromises = Object.entries(components).map(async ([componentName, componentPromise]) => {
          try {
            let component = await componentPromise
            console.log(componentName)

            loadedComponents[componentName] = ref(component.default)
          } catch (error) {
            console.error(`Failed to load component ${componentName}: ${error}`)
          }
        })

        await Promise.all(componentPromises)
      }

      watch(() => props.thisPageComponentName, loadComponents, { immediate: true })

      return {
        ...loadedComponents,
        site: ref(site),
        thisPageComponentName: toRef(props, 'thisPageComponentName'),
      }
    }
    }
    </script>