import { exec } from 'child_process'

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
    if (!parameters) {
        console.error('No parameters provided')
        return res.status(400).json({message: 'No parameters provided'})
    }
    for (const [key, value] of Object.entries(parameters)) {
        const valueAsString = String(value)
        if (!validateParameter(key, valueAsString)) {
            console.error(`Invalid parameter value: ${key}=${value}`)
            return res.status(400).json({message: 'Invalid parameter value'})
        }
    }

    function runCommands(commands, parameters, index, callback) {
        if (index >= commands.length) {
            callback(null);
            return;
        }
    
        const command = `${parameters} ${commands[index]}`;
        console.log(`Executing: ${command}\n`);
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing command: ${error.message}`);
                callback(error);
                return;
            }
    
            if (stderr) {
                console.error(`Error executing command: ${stderr}`);
                callback(new Error(stderr));
                return;
            }
    
            runCommands(commands, parameters, index + 1, callback);
        });
    }
    
    let changeDirectoryCommand = 'cd .. && cd frontend';
    console.log(`Changing directory: ${changeDirectoryCommand}`);
    exec(changeDirectoryCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error changing directory: ${error.message}`);
            return res.status(500).json({message: 'Error changing directory'});
        }
    
        if (stderr) {
            console.error(`Error changing directory: ${stderr}`);
            return res.status(500).json({message: 'Error changing directory'});
        }
    
        let parameters = 'NODE_ENV=production';
        for (const [name, value] of Object.entries(req.body)) {
            if (parameterLookup.hasOwnProperty(name)) {
                parameters += ` ${String(name)}="${String(value)}"`;
            }
        }
    
        const commands = [
            'cd ../frontend && node ./src/workers/buildCss.js',
            'cd ../frontend && npm run build',
            'cd ../frontend && npm run sitemap || true',
            'cd ../frontend && npm run process-site'
        ];
    
        runCommands(commands, parameters, 0, (error) => {
            if (error) {
                console.error(`Error executing commands: ${error.message}`);
                return res.status(500).json({message: 'Error executing build'});
            } else {
                console.log('Commands executed successfully');
                return res.status(200).json({message: 'Build executed successfully'});
            }
        });
    });
    
}

export default build