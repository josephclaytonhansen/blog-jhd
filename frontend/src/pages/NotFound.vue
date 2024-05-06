
<template>
<Header v-if = "header"/>
    <div>
        <component :is="components[`${site}${thisPageComponentName}`]"></component>
    </div>
    <Footer v-if = "footer" />
</template>

<script>
import { ref, onMounted } from 'vue'
import components from './NotFoundComponents.ts'
import Header from '../components/bricks/header.vue'
import Footer from '../components/bricks/footer.vue'

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
      props.thisPageComponentName = 'NotFound'
    }
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
