import fs from 'fs'
import fetch from 'node-fetch'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const getPosts = async () => {
    const response = await fetch(`${process.env.VITE_APP_SERVER_URL}/blog/`)
    if (response.ok){
        let data = await response.json()
        return data
    }
    return []
}

const updateRouterFile = async () => {
    const routerFilePath = path.resolve(__dirname, '../router.js')
    let routerFileContent = fs.readFileSync(routerFilePath, 'utf8')
    let posts = await getPosts()
    let addRoutes = []

    for (const post of posts) {
        let newRoute = ''
        if (post.subDirectory !== '' && post.subDirectory !== undefined && post.subDirectory !== '/') {
            newRoute = `{ path: '/${post.subDirectory}/${post.title}', component: () => import('./pages/SinglePost.vue'), props : {id: '${post._id}' },`
        } else {
            newRoute = `{ path: '/${post.title}', component: () => import('./pages/SinglePost.vue'), props : {id: '${post._id}' },`
        }
        addRoutes.push(newRoute)
    }

    let newRoutes = addRoutes.join("\n")

    // Remove existing routes
    let regexRemove = /(\n\/\/blogs)[\s\S]*?(\n\/\/end blogs)/
    routerFileContent = routerFileContent.replace(regexRemove, `$1\n//end blogs`)

    // Add new routes
    let regexAdd = /(\n\/\/end blogs)/
    routerFileContent = routerFileContent.replace(regexAdd, `\n${newRoutes}$1`)

    fs.writeFileSync(routerFilePath, routerFileContent)
}

try{
updateRouterFile()
updateRouterFile()
} catch (err) {
    console.log(err)
}