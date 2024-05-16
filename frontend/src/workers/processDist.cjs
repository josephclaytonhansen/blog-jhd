const fs = require('fs-extra')
const path = require('path')

const dirname = path.dirname(require.main.filename)

let distDir, newDistDir

try{
 distDir = path.resolve(dirname, '../../dist')
} catch (e) {
  console.error('An error occurred:', e)
}
const sitePrefix = process.env.SITE_PREFIX
if (!sitePrefix || sitePrefix === '') {
  throw new Error('SITE_PREFIX environment variable is required')
}
try{
 newDistDir = path.resolve(dirname, `../../dist.${sitePrefix}`)
} catch (e) {
  console.error('An error occurred:', e)
}

console.log(`distDir: ${distDir}`)
console.log(`newDistDir: ${newDistDir}`)

try {
  console.log(`Checking if ${newDistDir} exists...`)
  if (fs.existsSync(newDistDir)) {
    console.log(`Removing ${newDistDir}...`)
    fs.removeSync(newDistDir);
    console.log(`Removed ${newDistDir}.`)
  }

  console.log(`Copying ${distDir} to ${newDistDir}...`)
  fs.copySync(distDir, newDistDir);
  console.log(`Copied ${distDir} to ${newDistDir}.`)
} catch (e) {
  console.error('An error occurred:', e)
}