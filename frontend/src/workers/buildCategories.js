import fs from 'fs'
import fetch from 'node-fetch'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const thisSite = process.env.SITE_PREFIX

const getPosts = async () => {
    const response = await fetch(`${process.env.VITE_APP_SERVER_URL}/category/`)
    if (response.ok){
        let data = await response.json()
        return data
    }
    return []
}

const updateRouterFile = async () => {
    const routerFilePath = path.resolve(__dirname, '../router.js')
    let routerFileContent = fs.readFileSync(routerFilePath, 'utf8')
    let tags = await getPosts()
    let addRoutes = []

    for (const tag of tags) {
        let newRoute = ''
        if(tag.site === thisSite){
        
            newRoute = `{ path: '/tag/${tag.name}', component: () => import('./pages/SingleCategory.vue'), props : {category: '${category._id}'} },`
        
        addRoutes.push(newRoute)
    }}

    let newRoutes = addRoutes.join("\n")

    // Remove existing routes
    let regexRemove = /(\n\/\/categories)[\s\S]*?(\n\/\/end categories)/
    routerFileContent = routerFileContent.replace(regexRemove, `$1\n//end tags`)

    // Add new routes
    let regexAdd = /(\n\/\/end categories)/
    routerFileContent = routerFileContent.replace(regexAdd, `\n${newRoutes}$1`)

    fs.writeFileSync(routerFilePath, routerFileContent)
}

updateRouterFile()

updateRouterFile()