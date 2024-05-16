import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'
import process from 'process'

const parameterLookup = {
    THEME: {default: 'dark', allowedValues: ['dark', 'light', 'ultra-light']},
    FONT_SANS: {default: 'Fira Sans', allowedCharacters: "a-zA-Z "},
    BACKDROP_COLOR: {default: 'slate', allowedCharacters: "a-z"},
    ACCENT_COLOR: {default: 'cyan', allowedCharacters: "a-z"},
    ROUNDED: {default: 'rounded', allowedValues: ['subtle', 'rounded', 'sharp']},
    ROUND_AVATARS: {default: 'false', allowedValues: ['true', 'false']},
    READING_PROGRESS_BAR: {default: 'false', allowedValues: ['true', 'false']},
    COLOR_BLOCK: {default: 'false', allowedValues: ['true', 'false']},
    LINES: {default: 'false', allowedValues: ['true', 'false']},
    SIDEBAR: {default: 'false', allowedValues: ['true', 'false']},
    SIDEBAR_COLOR_BLOCK: {default: 'false', allowedValues: ['true', 'false']},
    FONT_SERIF: {default: 'Cormorant Garamond', allowedCharacters: "a-zA-Z "},
    SERIF_HEADER_TEXT: {default: 'false', allowedValues: ['true', 'false']},
    UPPERCASE_HEADERS: {default: 'false', allowedValues: ['true', 'false']},
    SERIF_BODY_TEXT: {default: 'false', allowedValues: ['true', 'false']},
    SITE_PREFIX: {default: 'example.com', allowedCharacters: "a-zA-Z0-9\\-\\.", format: '*.*'},
    BACKEND_URL: {default: 'https://example.com', allowedCharacters: "a-zA-Z0-9\\-\\.\\/:", format: 'https://*.*'},
}

const forbiddens = ['exec', 'spawn', 'fork', 'execFile', 'spawnSync', 'spawnSync', 'execFileSync', 'execFileSync', 'execSync', 'child_process', 'require', 'import', 'fs', 'path', 'dgram', 'dns', 'tls', 'stream', 'zlib', 'string_decoder', 'url', 'querystring', 'perf_hooks', 'worker_threads', 'v8', 'vm', 'inspector', 'module', 'cluster', 'assert', 'async_hooks', 'buffer', 'console', 'constants', 'inspector', 'process', 'punycode', 'querystring', 'readline', 'sudo', 'php', 'wget', 'fetch', 'curl', 'cd']

const validateParameter = (parameter, value) => {
    const lowerCaseParameter = String(parameter).toLowerCase()
    if (!Object.keys(parameterLookup).map(key => key.toLowerCase()).includes(lowerCaseParameter)) {
        return false
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

const existingConsoleLog = console.log
const existingConsoleError = console.error

const build = (req) => {
    if (!req) {
        req = {
            body: JSON.parse(process.argv[2])
        }
    }

    try {
        fs.writeFileSync('seabassBuild.txt', '')
    } catch (err) {
        console.error('Error clearing the log file:', err)
    }
    
    let logFile = fs.createWriteStream('seabassBuild.txt', {flags: 'a'})
    
    console.log = function(message) {
        fs.appendFileSync('seabassBuild.txt', message + '\n')
    }
    
    console.error = function(message) {
        fs.appendFileSync('seabassBuild.txt', message + '\n')
    }
    
    console.log('Building Seabass')

    const parameters = req.body
    if (!parameters) {
        console.error('No parameters provided')
        process.stdout.write(JSON.stringify({message: 'No parameters provided', status: 400}))
    }

    for (const [key, value] of Object.entries(parameterLookup)) {
        if (!parameters.hasOwnProperty(key)) {
            parameters[key] = value.default
        }
    }

    for (const [key, value] of Object.entries(parameters)) {
        const valueAsString = String(value)
        if (!validateParameter(key, valueAsString)) {
            console.error(`Invalid parameter value: ${key}=${value}`)
            process.stdout.write(JSON.stringify({message: `Invalid parameter value: ${key}=${value}`, status: 400}))
        }
    }

    let envVariables = Object.entries(parameters)
    .map(([key, value]) => `${key.toUpperCase()}="${value}"`)
    .join(' ')

    let commands = [
        'cd ../frontend && git pull || true',
        'cd ../frontend && ' + `${envVariables} node ./src/workers/buildCss.js`,
        'cd ../frontend && ' + `${envVariables} node ./src/workers/buildSitemap.js || true`,
        'cd ../frontend && ' + `${envVariables} node commit.js || true`,
        'cd ../frontend && ' + `${envVariables} npm run build`,
        'cd ../frontend && ' + `${envVariables} npm run process-site`
    ]

    async function runCommand(index) {
        if (index >= commands.length) {
            console.log = existingConsoleLog
            console.error = existingConsoleError
            let readLog = fs.readFileSync('seabassBuild.txt', 'utf8')
            process.stdout.write(JSON.stringify({message: 'Build executed successfully', logFile: readLog, status: 200}))
        }

        try {
            const { stdout, stderr } = await exec(commands[index])
            console.log(`Command: ${commands[index]}`)
            if (stdout) {
                console.log(`Output: ${JSON.stringify(stdout)}`)
            }
            if (stderr) {
                console.log(`Warning: ${JSON.stringify(stderr)}`)
                if (!(stderr.toString().includes('warnings when minifying css')) || !(stderr.toString().includes('github'))) {
                    console.error(`Error executing command: ${JSON.stringify(stderr)}`)
                    console.log('This is a non-blocking error, Seabass build will proceed')
                }
            }
        } catch (error) {
            console.error(`Exec error: ${error}`)
            process.stdout.write(JSON.stringify({message: 'Error executing build', status: 500}))
            return
        }

        return runCommand(index + 1)
    }

    return runCommand(0)
}

export default build

import { fileURLToPath } from 'url'
import { basename } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __basename = basename(__filename)

if (process.argv[1].endsWith(__basename)) {
    (async () => {
        const result = await build()
        console.log(JSON.stringify(result))
    })()
}