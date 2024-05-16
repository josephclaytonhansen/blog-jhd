import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'

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

const build = (body) => {

    fs.writeFileSync('seabassBuild.txt', '')
    let logFile = fs.createWriteStream('seabassBuild.txt', {flags: 'a'});

    console.log = function(msg) {
        logFile.write(msg + '\n')
    }
    console.error = function(msg) {
        logFile.write(msg + '\n')
    }

    console.log('Building Seabass')

    const parameters = body
    if (!parameters) {
        console.error('No parameters provided')
        process.stdout.write(JSON.stringify({message: 'No parameters provided', status: 400}))
        return
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
            return
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

    function runCommand(index) {
        if (index >= commands.length) {
            console.log('All commands executed successfully')
            console.log = existingConsoleLog
            console.error = existingConsoleError
            process.stdout.write(JSON.stringify({message: 'Build executed successfully', status: 200}))
        }

        exec(commands[index], (error, stdout, stderr) => {
            if (stdout) {
                console.log(`Output: ${stdout}`)
            }
            if (stderr) {
                console.log(`Warning: ${stderr}`)
                if (!(stderr.includes('warnings when minifying css')) || !(stderr.includes('github')) || !(stderr.includes('ERR_INVALID_ARG_TYPE'))) {
                    console.error(`Error executing command: ${stderr}`)
                    console.log('This is a non-blocking error, Seabass build will proceed')
                }
            }
            if (error) {
                console.error(`Exec error: ${error}`)
                process.stdout.write(JSON.stringify({message: 'Build failed', logFile: 'An error occurred', status: 500}))
                return
            }

            runCommand(index + 1)
        })
    }

    runCommand(0)
}

export default build

import { fileURLToPath } from 'url'
import { basename } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __basename = basename(__filename)

if (process.argv[1].endsWith(__basename)) {
    (async () => {
        const parameters = JSON.parse(process.argv[2])
        const result = await build( parameters )
        console.log(JSON.stringify(result))
    })()
}