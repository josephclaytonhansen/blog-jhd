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
  background-color: ${process.env.COLOR_BLOCK === 'true' ? 'theme(\'colors.accent.700\')' : 'transparent'};
  color: ${process.env.COLOR_BLOCK === 'true' ? 'theme(\'colors.backdrop.100\')' : 'transparent'};
}

.dividing-line{
  border-bottom: ${process.env.LINES === 'true' ? '1px solid theme(\'colors.backdrop-0\')' : 'none'};
  width: 100%;
  margin-bottom: ${process.env.LINES === 'true' ? '2rem' : '1rem'};
  margin-top: ${process.env.LINES === 'true' ? '2rem' : '1rem'};
}

.dividing-line-mid{
  border-right: ${process.env.LINES === 'true' ? '1px solid theme(\'colors.backdrop-0\')' : 'none'};
  height: 100%;
  margin-left: ${process.env.LINES === 'true' ? '2rem' : '1rem'};
  margin-right: ${process.env.LINES === 'true' ? '2rem' : '1rem'};
}

.colorblock_accent .dividing-line{
  border-bottom: ${process.env.LINES === 'true' ? '1px solid theme(\'colors.accent.600\')' : 'none'};
}

.sidebar{
  display: ${process.env.SIDEBAR === 'true' ? 'flex' : 'none!important'};
}

.sidebar.colorblock_accent{
  background-color: ${process.env.SIDEBAR_COLOR_BLOCK === 'true' ? 'theme(\'colors.accent.700\')' : 'transparent'};
  color: ${process.env.SIDEBAR_COLOR_BLOCK === 'true' ? 'theme(\'colors.backdrop.100\')' : 'theme(\'colors.text.0\')'};

}

@layer components {
  #post_content {
    margin: auto;
    width: 80vw;
    max-width: 70ch;
  }
  @screen sm {
    #post_content {
      width: 70vw;
    }
  }
  @screen md {
    #post_content {
      width: 60vw;
    }
  }
  @screen lg {
    #post_content {
      width: 50vw;
    }
  }
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