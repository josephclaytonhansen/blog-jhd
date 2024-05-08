import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const css = `
/* automated */
h1, h2 {
  text-transform: ${process.env.UPPERCASE_HEADERS === 'true' ? 'uppercase' : 'none'};
}
h1, h2, h3, h4, h5, h6 {
  font-family: '${process.env.SERIF_HEADER_TEXT === 'true' ? process.env.FONT_SERIF : process.env.FONT_SANS}';
}

body {
  font-family: '${process.env.SERIF_BODY_TEXT === 'true' ? process.env.FONT_SERIF : process.env.FONT_SANS}';
}

${process.env.ROUND_AVATARS === 'true' ? '.avatar{border-radius:999rem;}\n' : ''}

#progress-bar, #progress-bar-fill{
  display: ${process.env.READING_PROGRESS_BAR === 'true' ? 'block' : 'none'};
}

.colorblock{
  background-color: ${process.env.COLOR_BLOCK === 'true' ? 'theme(\'colors.backdrop-2\')' : 'transparent'};
}

.colorblock_accent{
  background-color: ${process.env.COLOR_BLOCK === 'true' ? 'theme(\'colors.accent.500\')' : 'transparent'};
  color: ${process.env.COLOR_BLOCK === 'true' ? 'theme(\'colors.backdrop.800\')' : 'transparent'};
}

.dividing-line{
  border-bottom: ${process.env.LINES === 'true' ? '1px solid theme(\'colors.backdrop-0\')' : 'none'};
  width: 100%;
  margin-bottom: ${process.env.LINES === 'true' ? '2rem' : '1rem'};
  margin-top: ${process.env.LINES === 'true' ? '2rem' : '1rem'};
}
/* end automated */
`

const dirname = path.dirname(fileURLToPath(import.meta.url))
const filePath = path.resolve(dirname, '../style.css')
const fileContent = fs.readFileSync(filePath, 'utf8')

if (!fileContent.includes('\n/* automated */')) {
  fs.appendFileSync(filePath, css)
} else {
  let startPoint = fileContent.indexOf('\n/* automated */')
  let endPoint = fileContent.indexOf('/* end automated */') + '/* end automated */'.length
  fs.writeFileSync(filePath, fileContent.slice(0, startPoint) + css + fileContent.slice(endPoint))
}