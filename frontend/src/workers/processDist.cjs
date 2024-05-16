const fs = require('fs-extra')
const path = require('path')

const dirname = path.dirname(require.main.filename)

const distDir = path.resolve(dirname, '../../dist')
const sitePrefix = process.env.SITE_PREFIX
if (!sitePrefix || sitePrefix === '') {
  throw new Error('SITE_PREFIX environment variable is required')
}
const newDistDir = path.resolve(dirname, `../../dist.${sitePrefix}`)

console.log(`distDir: ${distDir}`)
console.log(`newDistDir: ${newDistDir}`)

try{
if (fs.existsSync(newDistDir)) {
  fs.removeSync(newDistDir)
}

fs.copySync(distDir, newDistDir)
} catch (e) {
  console.error('An error occurred:', e)
}