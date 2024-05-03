const mainPageOutput = `
<script setup>
import { ref, onMounted } from 'vue'
import Header from '../components/bricks/header.vue'
import Footer from '../components/footer.vue'

const site = window.location.hostname
const components = ref({})
const prefixes = ref([])

const props = defineProps({thisPageComponentName: {type: String,}})

onMounted(async () => {
    prefixes.value = process.env.VUE_APP_FRONTEND_PREFIXES

    for (let i = 0; i < prefixes.value.length; i++) {
        let prefix = prefixes.value[i]
        let componentName = \`\${prefix}_\${props.thisPageComponentName}\`
        let importPath = \`./\${prefix}/\${props.thisPageComponentName}.vue\`
        console.log(importPath)

        components.value[componentName] = (await import(/* @vite-ignore */ importPath)).default
    }
})
</script>

<template>
    <Header />
    <div>
        <component :is="components[\`\${site}_\${thisPageComponentName}\`]"></component>
    </div>
    <Footer />
</template>
`

const subDirectoryPageOutput = `
<script setup>
</script>
<template>
</template>`

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const createMainPage = (title) => {
    const dirname = path.dirname(fileURLToPath(import.meta.url))
    const filePath = path.resolve(dirname, `../pages/${title}.vue`)
    if (fs.existsSync(filePath)) {
        return
    } else {
        fs.writeFileSync(filePath, mainPageOutput)
    }
}

const createSubDirectoryPage = (subDirectory, title) => {
    const dirname = path.dirname(fileURLToPath(import.meta.url))
    const filePath = path.resolve(dirname, `../pages/${subDirectory}/${title}.vue`)
    if (fs.existsSync(filePath)) {
        return
    } else {
        fs.writeFileSync(filePath, subDirectoryPageOutput)
    }
}

const pagesDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../pages/');
const dirents = fs.readdirSync(pagesDir, { withFileTypes: true });
const subDirectories = dirents.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);


const createPages = () => {
    const title = process.argv[2];
    if (!title) {
        console.error('Please provide a title as a command line argument.')
        process.exit(1)
    }
    createMainPage(title)
    subDirectories.forEach(subDirectory => {
        createSubDirectoryPage(subDirectory, title)
    })
}

createPages()
