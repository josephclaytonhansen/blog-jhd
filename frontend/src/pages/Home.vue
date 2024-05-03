
<script setup>
import { ref, onMounted } from 'vue'
import { useHead } from '@vueuse/head'
import Header from '../components/bricks/header.vue'
import Footer from '../components/footer.vue'

useHead({
    title: '',
    meta: [
        {
        }
    ]
})

const site = window.location.hostname
const components = ref({})
const prefixes = ref([])

const props = defineProps({thisPageComponentName: {type: String,}})

onMounted(async () => {
    prefixes.value = process.env.VUE_APP_FRONTEND_PREFIXES

    for (let i = 0; i < prefixes.value.length; i++) {
        let prefix = prefixes.value[i]
        let componentName = `${prefix}_${props.thisPageComponentName}`
        let importPath = `./${prefix}/${props.thisPageComponentName}.vue`
        console.log(importPath)

        components.value[componentName] = (await import(/* @vite-ignore */ importPath)).default
    }
})
</script>

<template>
    <Header />
    <div>
        <component :is="components[`${site}_${thisPageComponentName}`]"></component>
    </div>
    <Footer />
</template>
