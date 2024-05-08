import fs from 'fs'
import fetch from 'node-fetch'
import path, { fileURLToPath } from 'path'
import { URL } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const getPosts = async () => {
    const response = await fetch(`${process.env.VUE_APP_SERVER_URL}/blog/`)
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
        const newRoute = `{ path: '/${post.title}', component: () => import('./components/Post.vue'), props : {post: ${JSON.stringify(post)}} },`
        addRoutes.push(newRoute)
    }

    let newRoutes = addRoutes.join("\n")

    let regex = /(\n\/\/blogs)[\s\S]*?(\n\/\/end blogs)/

    routerFileContent = routerFileContent.replace(regex, `$1\n${newRoutes}$2`)

    fs.writeFileSync(routerFilePath, routerFileContent)
}

updateRouterFile()