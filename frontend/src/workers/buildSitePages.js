const mainPageOutput = (pageName) => `
<template>
<Header v-if = "header"/>
    <div>
        <component :is="components[\`\${site}\${thisPageComponentName}\`]"></component>
    </div>
    <Footer v-if = "footer" />
</template>

<script>
import { ref, onMounted } from 'vue'
import components from './${pageName}Components.ts'
import Header from '../components/bricks/sitewide/Header.vue'
import Footer from '../components/bricks/sitewide/Footer.vue'

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
      header: props.header,
      footer: props.footer
    }
  }
}
</script>
`

const subDirectoryPageOutput = `
<script>
</script>
<template></template>`

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

function createMainPage(title) {
    const dirname = path.dirname(fileURLToPath(import.meta.url))
    let pagesDirs = []

    if (!process.argv[3]) {
        const pagesDir = path.resolve(dirname, '../pages/')
        const dirents = fs.readdirSync(pagesDir, { withFileTypes: true });
        pagesDirs = dirents.filter(dirent => dirent.isDirectory() && dirent.name !== 'cms').map(dirent => dirent.name);
    } else {
        pagesDirs = JSON.parse(process.argv[3])
    }

    // Create Test.vue in the /pages directory
    const mainPageContent = mainPageOutput(title);
    fs.writeFile(path.join(dirname, '../pages', `${title}.vue`), mainPageContent, (err) => {
        if (err) throw err
    });

    // Create Test.vue in the subdirectories of the /pages directory
    for (const pagesDir of pagesDirs) {
        const fullPath = path.resolve(dirname, '../pages', pagesDir)
        const files = fs.readdirSync(fullPath)
        const titleLower = `${title}.vue`.toLowerCase()
        const hasFile = files.some(file => file.toLowerCase() === titleLower)

        if (hasFile) {
            console.log(`A file with the title ${title} already exists in ${pagesDir}.`)
            process.exit(1)
        } 

        const output = subDirectoryPageOutput
        fs.writeFile(path.join(fullPath, `${title}.vue`), output, (err) => {
            if (err) throw err
        })
    }
    const componentsOutput = `
    let prefixes = process.env.VUE_APP_FRONTEND_PREFIXES;
    
    let components = {};
    
    for (let prefix of prefixes) {
        components[\`\${prefix}${title}\`] = import(\`./\${prefix}/${title}.vue\`);
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

function updateRouterFile(pageName) {
    const dirname = path.dirname(fileURLToPath(import.meta.url))
    const routerFilePath = path.resolve(dirname, '../router.js')
    let routerFileContent = fs.readFileSync(routerFilePath, 'utf8')

    const newRoute = `{ path: '/${pageName}', component: () => import('./pages/${pageName}.vue'), props : {thisPageComponentName: '${pageName}', header: ${process.argv[4] !== 'no-header'}, footer: ${process.argv[5] !== 'no-footer'}} },`

    const automatedRoutesMatch = routerFileContent.match(/\/\/ automated([\s\S]*?)\/\/end automated/)
    let automatedRoutes = automatedRoutesMatch ? automatedRoutesMatch[1] : ''

    const routePathAndComponent = `{ path: '/${pageName}', component: () => import('./pages/${pageName}.vue')`

    if (!automatedRoutes.includes(routePathAndComponent)) {
        automatedRoutes += `${newRoute}\n`
        routerFileContent = routerFileContent.replace(/\/\/ automated([\s\S]*?)\/\/end automated/, `// automated${automatedRoutes}//end automated`)
        fs.writeFileSync(routerFilePath, routerFileContent)
    }
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
    updateRouterFile(title)
}

createPages()
