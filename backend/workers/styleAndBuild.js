import { exec } from 'child_process'

const parameterLookup = {
    THEME: {default: 'dark', allowedValues: ['dark', 'light', 'ultra-light']},
    FONT_SANS: {default: 'Fira Sans', allowedCharacters: "azAZ "},
    BACKDROP_COLOR: {default: 'slate', allowedCharacters: "az"},
    ACCENT_COLOR: {default: 'cyan', allowedCharacters: "az"},
    ROUNDED: {default: 'false', allowedValues: ['true', 'false']},
    ROUND_AVATARS: {default: 'false', allowedValues: ['true', 'false']},
    READING_PROGRESS_BAR: {default: 'false', allowedValues: ['true', 'false']},
    COLOR_BLOCK: {default: 'false', allowedValues: ['true', 'false']},
    LINES: {default: 'false', allowedValues: ['true', 'false']},
    SIDEBAR: {default: 'false', allowedValues: ['true', 'false']},
    SIDEBAR_COLOR_BLOCK: {default: 'false', allowedValues: ['true', 'false']},
    FONT_SERIF: {default: 'Cormorant Garamond', allowedCharacters: "azAZ "},
    SERIF_HEADER_TEXT: {default: 'false', allowedValues: ['true', 'false']},
    UPPERCASE_HEADERS: {default: 'false', allowedValues: ['true', 'false']},
    SERIF_BODY_TEXT: {default: 'false', allowedValues: ['true', 'false']},
    SITE_PREFIX: {default: 'example.com', allowedCharacters: "azAZ09-.", format: '*.*'},
    BACKEND_URL: {default: 'https://example.com', allowedCharacters: "azAZ09-./:", format: 'https://*.*'},
}

const forbiddens = ['exec', 'spawn', 'fork', 'execFile', 'spawnSync', 'spawnSync', 'execFileSync', 'execFileSync', 'execSync', 'child_process', 'require', 'import', 'fs', 'path', 'dgram', 'dns', 'tls', 'stream', 'zlib', 'string_decoder', 'url', 'querystring', 'perf_hooks', 'worker_threads', 'v8', 'vm', 'inspector', 'module', 'cluster', 'assert', 'async_hooks', 'buffer', 'console', 'constants', 'inspector', 'process', 'punycode', 'querystring', 'readline', 'sudo', 'php', 'wget', 'fetch', 'curl', 'cd']

const validateParameter = (parameter, value) => {
    const lowerCaseParameter = String(parameter).toLowerCase()
    if (!Object.keys(parameterLookup).map(key => key.toLowerCase()).includes(lowerCaseParameter)) {
        return false;
    }
    const lookup = parameterLookup[parameter]
    if (!lookup) {
        return false
    }
    if (lookup.allowedValues && !lookup.allowedValues.includes(value)) {
        return false
    }
    if (lookup.allowedCharacters && !value.match(new RegExp(`^[${lookup.allowedCharacters}]+$`))) {
        return false
    }
    if (lookup.format && !value.match(new RegExp(`^${lookup.format.replace(/\*/g, '.*')}$`))) {
        return false
    }
    if (forbiddens.some((forbidden) => value.includes(forbidden))) {
        return false
    }
    return true
}

const build = (req, res, next) => {
    const parameters = req.body
    parameters.forEach((parameter) => {
        if (!validateParameter(parameter.name, parameter.value)) {
            return res.status(400).json({message: 'Invalid parameter value'})
        }
    })

    let command = ''

    for (let i = 0; i < parameters.length; i++) {
        command += ` ${String(parameters[i].name)}="${String(parameters[i].value)}"`
    }

    command += ' cd ../ && npm run buildbot'

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing build: ${error.message}`)
            return res.status(500).json({message: 'Error executing build'})
        }

        if (stderr) {
            console.error(`Error executing build: ${stderr}`)
            return res.status(500).json({message: 'Error executing build'})
        }

        console.log(`Build complete: ${stdout}`)
        return res.status(200).json({message: 'Build complete'})
    })
}

export default build