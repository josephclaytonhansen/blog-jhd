// TODO: Set up npm-remove-site to delete routes

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const dirname = path.dirname(fileURLToPath(import.meta.url))
let pagesDir = path.resolve(dirname, '../pages/')
let site = process.argv[2]
if (!site) {
    console.error('Please provide a site to remove.')
    process.exit(1)
}

let siteDir = path.resolve(pagesDir, site)
if (!fs.existsSync(siteDir)) {
    console.error('Site not found- check your spelling, or run npm create-site.')
    process.exit(1)
}

fs.rmSync(siteDir, { recursive: true })

let frontendEnv = path.resolve(dirname, '../.env')
let env = fs.readFileSync(frontendEnv, 'utf8')

let existingSites = env.match(/VITE_APP_FRONTEND_PREFIXES=(.*)/)[1]
if (!existingSites.includes(site)) {
    console.error('Site not found- check your spelling, or run npm create-site.')
    process.exit(1)
}
let newSites = existingSites.split(',').filter(s => s !== site).join(',')
env = env.replace(/VITE_APP_FRONTEND_PREFIXES=(.*)/, `VITE_APP_FRONTEND_PREFIXES=${newSites}`)
fs.writeFileSync(frontendEnv, env, 'utf8')
