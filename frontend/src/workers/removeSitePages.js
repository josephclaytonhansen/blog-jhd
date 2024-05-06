import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

function removeSitePage() {
    const title = process.argv[2];
    const dirname = path.dirname(fileURLToPath(import.meta.url));

    try {
        fs.unlinkSync(path.join(dirname, '../pages', `${title}.vue`))
        fs.unlinkSync(path.join(dirname, '../pages', `${title}Components.ts`))
    } catch (e) {
        console.warn(e.message)
    }

    const pagesDir = path.resolve(dirname, '../pages/');
    const dirents = fs.readdirSync(pagesDir, { withFileTypes: true });
    const subDirectories = dirents.filter(dirent => dirent.isDirectory() && dirent.name !== 'cms').map(dirent => dirent.name);

    for (const subdirectory of subDirectories) {
        try {
            fs.unlinkSync(path.join(pagesDir, subdirectory, `${title}.vue`))
        } catch (e) {
            console.warn(e.message)
        }
    }

    const routerPath = path.join(dirname, '../router.js')
    let routerContent = fs.readFileSync(routerPath, 'utf8')

    let sanitizedTitle = title.replace(/[^a-zA-Z0-9._-]/g, '').replace(/\.{2,}/g, '.')

    const routeRegex = new RegExp(`{\\s*path:\\s*'/${sanitizedTitle}',\\s*component:\\s*\\(\\)\\s*=>\\s*import\\(\\s*'\\.\\/pages\\/${sanitizedTitle}\\.vue'\\s*\\),\\s*props\\s*:\\s*\\{\\s*thisPageComponentName:\\s*'${sanitizedTitle}',\\s*header:\\s*true,\\s*footer:\\s*true\\s*\\}\\s*},?`, 'g')
    routerContent = routerContent.replace(routeRegex, '')

    fs.writeFileSync(routerPath, routerContent)
}

removeSitePage()