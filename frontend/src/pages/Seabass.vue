
<template>
<Header v-if = "header"/>
    <div>
        <component :is="components[`${site}${thisPageComponentName}`]"></component>
    </div>
    <Footer v-if = "footer" />
</template>

<script>
import { ref, onMounted } from 'vue'
import components from './SeabassComponents.ts'
import Header from '../components/bricks/sitewide/Header.vue'
import Footer from '../components/bricks/sitewide/Footer.vue'

import { useRoute, useRouter } from 'vue-router'
const router = useRouter()

export default {
  props: {
    thisPageComponentName: String,
    header: {Boolean, default: true},
    footer: {Boolean, default: true}
  },
  setup(props) {
    const loadedComponents = ref({})
    if (props.header === undefined) {
        props.header = true
      }
      if (props.footer === undefined) {
        props.footer = true
      }
      if (props.thisPageComponentName === undefined) {
        router.push('/NotFound')
      }
    const site = window.location.hostname

    onMounted(async () => {
      for (let componentName in components) {
        // Wait for the component to be imported
        let component = await components[componentName].catch((error) => {
            router.push('/NotFound')
        })

        // Use the component
        loadedComponents.value[componentName] = component.default
      }
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
