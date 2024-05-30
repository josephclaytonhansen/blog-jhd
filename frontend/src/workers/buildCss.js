import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const css = `
/* automated */
h1, h2 {
  text-transform: ${process.env.UPPERCASE_HEADERS === 'true' ? 'uppercase' : 'none'};
}
h1, h2, h3, h4, h5, h6 {
  font-family: '${process.env.FONT_HEADER}';
}

body {
  font-family: '${process.env.FONT_BODY}';
}

${process.env.ROUND_AVATARS === 'true' ? '.avatar{border-radius:999rem;}\n' : ''}

#progress-bar, #progress-bar-fill{
  display: ${process.env.READING_PROGRESS_BAR === 'true' ? 'block' : 'none'};
}

.colorblock{
  background-color: ${process.env.COLOR_BLOCK === 'true' ? 'theme(\'colors.backdrop-2\')' : 'transparent'};
  ${!(process.env.COLOR_BLOCK) ? 'padding: none!important;': ''}
}

.colorblock_dark{
  background-color: ${process.env.COLOR_BLOCK === 'true' ? 'theme(\'colors.backdrop-1\')' : 'transparent'};
  ${!(process.env.COLOR_BLOCK) ? 'padding: none!important;': ''}
}

.colorblock_darker {
  background-color: ${process.env.COLOR_BLOCK === 'true' ? 'theme(\'colors.backdrop-0\')' : 'transparent'};
  ${!(process.env.COLOR_BLOCK) ? 'padding: none!important;': ''}
}

.colorblock_accent{
  background-color: ${process.env.COLOR_BLOCK === 'true' ? 'theme(\'colors.accent.700\')' : 'transparent'};
  ${process.env.COLOR_BLOCK === 'true' ? 'color:theme(\'colors.backdrop.100\')' : ''};
  ${!(process.env.COLOR_BLOCK) ? 'padding: none!important;': ''}
}

.dividing-line{
  border-bottom: ${process.env.LINES === 'true' ? '2px solid theme(\'colors.backdrop-0\')' : 'none'};
  width: 100%;
  margin-bottom: ${process.env.LINES === 'true' ? '2rem' : '1rem'};
  margin-top: ${process.env.LINES === 'true' ? '2rem' : '1rem'};
  border-top-width: 0;
}

.dividing-line-mid{
  border-right: ${process.env.LINES === 'true' ? '2px solid theme(\'colors.backdrop-0\')' : 'none'};
  height: 100%;
  margin-left: ${process.env.LINES === 'true' ? '2rem' : '1rem'};
  margin-right: ${process.env.LINES === 'true' ? '2rem' : '1rem'};
  border-top-width: 0;
}

.colorblock_accent .dividing-line{
  border-bottom: ${process.env.LINES === 'true' ? '1px solid theme(\'colors.accent.600\')' : 'none'};
}

.sidebar{
  display: ${process.env.SIDEBAR === 'true' ? 'flex' : 'none!important'};
  background-color: ${process.env.SIDEBAR_COLOR_BLOCK === 'true' ? 'theme(\'colors.backdrop-2\')' : 'transparent'};
  color: ${process.env.SIDEBAR_COLOR_BLOCK === 'true' ? 'theme(\'colors.backdrop.200\')' : 'theme(\'colors.text-0\')'};

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