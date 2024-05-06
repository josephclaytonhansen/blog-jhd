const mainPageOutput = (pageName) => `
<template>
    <Header />
    <div>
        <component :is="components[\`\${site}_\${thisPageComponentName}\`]"></component>
    </div>
    <Footer />
</template>

<script>
import { ref, onMounted } from 'vue'
import components from './${pageName}Components.ts'

export default {
  props: {
    thisPageComponentName: String
  },
  setup(props) {
    const loadedComponents = ref({})
    const site = window.location.hostname.split('.')[0]
    console.log(site, props.thisPageComponentName)

    onMounted(async () => {
      for (let componentName in components) {
        // Wait for the component to be imported
        let component = await components[componentName]

        // Use the component
        loadedComponents.value[componentName] = component.default
        console.log(loadedComponents.value[componentName])
      }
    })

    return {
      components: loadedComponents,
      site,
      thisPageComponentName: props.thisPageComponentName
    }
  }
}
</script>
`

const subDirectoryPageOutput = `
<script setup>
</script>
<template>
</template>`

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

function createMainPage(title) {
    const output = mainPageOutput(title);
    fs.writeFile(path.join(pagesDir, `${title}.vue`), output, (err) => {
        if (err) throw err;
    });

    const componentsOutput = `
let prefixes = process.env.VUE_APP_FRONTEND_PREFIXES.split;

let components = {};

for (let prefix of prefixes) {
    components[\`\${prefix}${title}\`] = import('./' + prefix + '/${title}.vue');
}

export default components;
`;
    fs.writeFile(path.join(pagesDir, `${title}Components.ts`), componentsOutput, (err) => {
        if (err) throw err;
    });
}

function createSubDirectoryPage(directory, title) {
    const output = subDirectoryPageOutput;
    fs.writeFile(path.join(pagesDir, directory, `${title}.vue`), output, (err) => {
        if (err) throw err;
    });
}

const pagesDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../pages/');
const dirents = fs.readdirSync(pagesDir, { withFileTypes: true });
const subDirectories = dirents.filter(dirent => dirent.isDirectory() && dirent.name !== 'cms').map(dirent => dirent.name);

const createPages = () => {
    const title = process.argv[2];
    let whichDirectory = []
    if (!process.argv[3]) {
        whichDirectory = subDirectories
    }  else {
    whichDirectory = JSON.parse(process.argv[3]);}
    
    for (let di in whichDirectory) {
        if (!subDirectories.includes(whichDirectory[di])) {
            console.error('Site not found- check your spelling, or run npm create-site.')
            process.exit(1)
        }
    }
    if (!title) {
        console.error('Please provide a title for the new page.')
        process.exit(1)
    }
    createMainPage(title)
    for (let di in whichDirectory) {
        createSubDirectoryPage(whichDirectory[di], title)
    }
}

createPages()
