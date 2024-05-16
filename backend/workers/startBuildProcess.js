import { spawn } from 'child_process'
import path from 'path'
let jobs = {}
let jobId = 0
const startBuildProcess = async (req, processFunction, jobs, jobId) => {
    console.log('Starting build process')
    console.log(req.body)
    jobId++
    jobs[jobId] = { status: 202 }

    const buildProcess = spawn('node', [path.join(process.cwd(), processFunction), JSON.stringify(req.body), jobId.toString()])

    buildProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`)
        const result = JSON.parse(data)
        jobs[jobId] = result
    })

    buildProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`)
        const result = JSON.parse(data)
        jobs[jobId] = result
    })

    buildProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`)
        if (code !== 0) {
            jobs[jobId] = { message: 'Build failed', status: 500 }
        }
    });

    return jobId
}

export default startBuildProcess