async function startBuildProcess(req, processFunction, jobs, jobId) {
    console.log('Starting build process')
    console.log(req.body)
    jobId++
    jobs[jobId] = { status: 202 }

    const buildProcess = spawn('node', [path.join(process.cwd(), processFunction), JSON.stringify(req.body), jobId.toString()])

    buildProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`)
        const result = JSON.parse(data)
        jobs[jobId] = result
        if (result.status === 200) {
            buildProcess.kill()
            return
        }
    })

    buildProcess.stderr.on('data', (data) => {
        if (jobs[jobId].status === 200) {
            return
        }
        console.error(`stderr: ${data}`)
        let result
        try {
            result = JSON.parse(data)
        } catch (e) {
            result = { message: data.toString(), status: 500 }
        }
        jobs[jobId] = result
    })

    buildProcess.on('close', (code, signal) => {
        console.log(`child process exited with code ${code} and signal ${signal}`)
        if (code !== 0 && signal !== 'SIGTERM') {
            jobs[jobId] = { message: 'Build failed', status: 500 }
        }
    })

    return jobId
}

export default startBuildProcess