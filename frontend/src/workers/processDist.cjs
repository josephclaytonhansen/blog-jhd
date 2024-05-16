const fs = require('fs-extra');
const path = require('path');
const { fileURLToPath } = require('url');

const dirname = path.dirname(fileURLToPath(require.main.filename));

const distDir = path.resolve(dirname, '../../dist');
const sitePrefix = process.env.SITE_PREFIX;
if (!sitePrefix || sitePrefix === '') {
  throw new Error('SITE_PREFIX environment variable is required');
}
const newDistDir = path.resolve(dirname, `../../dist.${sitePrefix}`);

if (fs.existsSync(newDistDir)) {
  fs.removeSync(newDistDir);
}

fs.copySync(distDir, newDistDir);