import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const distDir = path.resolve(dirname, './dist')
const sitePrefix = process.env.SITE_PREFIX
if (!sitePrefix || sitePrefix === '') {
  throw new Error('SITE_PREFIX environment variable is required')
}
const newDistDir = path.resolve(dirname, `./dist.${sitePrefix}`)

if (fs.existsSync(newDistDir)) {
  fs.removeSync(newDistDir)
}

fs.copySync(distDir, newDistDir)

console.log(`Copied 'dist' to '${newDistDir}'`)