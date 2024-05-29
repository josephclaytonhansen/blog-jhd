import db from './mongo.js'
import Blog from './models/blog.js'
import User from './models/user.js'
import Comment from './models/comment.js'
import { exec } from 'child_process'

import { authenticateToken } from './middleware/authenticateToken.js'

import express from 'express'
import compression from 'compression'

import cors from 'cors'
import dotenv from 'dotenv'
import rate_limit from 'express-rate-limit'

import nodemailer from 'nodemailer'
import cron from 'node-cron'

import passport from 'passport'

import cookieParser from 'cookie-parser'

import userRoutes from './routes/userRoutes.js'
import blogRoutes from './routes/blogRoutes.js'
import eventRoutes from './routes/eventRoutes.js'
import commentRoutes from './routes/commentRoutes.js'
import tagRoutes from './routes/tagRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'

import process from 'process'

import fs from 'fs'
import path from 'path'

let dir = process.cwd()

const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_FROM_USERNAME,
      pass: process.env.EMAIL_FROM_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  })

const removedUsers = []

const app = express()
app.disable('x-powered-by')
app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal'])

var corsOptions = {    origin:['https://seabass.josephhansen.dev','seabass.josephhansen.dev','https://blog.josephhansen.dev','blog.josephhasen.dev','hansenstudios.art','https://hansenstudios.art'],   credentials:true, optionsSuccessStatus: 200,  }
app.use(cors(corsOptions));


app.use(express.urlencoded({
    extended: false
}))

app.use(compression())

dotenv.config()

app.use(express.json())

app.use(cookieParser(process.env.COOKIE_PARSER_SECRET))

app.use(passport.initialize())

passport.serializeUser(async function (user, done) {
    done(null, user.id)
})

passport.deserializeUser(function (id, done) {
    User.findById(id).then((user) => {
        done(null, user)
    })
})

const limiter = rate_limit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
})

const buildLimiter = rate_limit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
})

import startBuildProcess from './workers/startBuildProcess.js'

let jobs = {}

let jobId = 0
const jobIdFilePath = path.join(dir, '.jobid')

try {
    if (fs.existsSync(jobIdFilePath)) {
        jobId = Number(fs.readFileSync(jobIdFilePath, 'utf8'))
    } else {
        fs.writeFileSync(jobIdFilePath, '0')
    }
} catch (err) {
    console.error('Failed to load or create jobId file:', err)
}

app.post('/build', [buildLimiter, authenticateToken], async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== 'admin') {
        return res.status(403).send('Not authorized')
    }
    jobId++
    fs.writeFile(path.join(dir, '.jobid'), String(jobId), (err) => {
        if (err) {
            console.error('Failed to save jobId to file:', err)
        }
    })
    startBuildProcess(req, '/workers/styleAndBuild.js', jobs, jobId)
    res.status(202).json({ message: "Seabass build in progress", jobId: jobId })
})

app.get('/build/:jobId', (req, res) => {
    jobId = Number(req.params.jobId)
    const job = jobs[jobId]
    if (!job) {
        return res.status(404).json({ message: 'Job not found', jobs: jobs, jobId: jobId})
    } else if (job.status === 500){
        return res.status(500).json({message: job.message})
    } else if (job.status === 400){
        return res.status(400).json({message: job.message})
    }
    else {
        res.status(200).json({message: job.message, logFile: job.logFile? job.logFile : 'No log file available', status: job.status})
    }
})

if (process.env.NODE_ENV === 'production') {
app.use(limiter)
}

app.use((req, res, next) => {
    res.setHeader('Referrer-Policy', 'no-referrer')
    next()
})

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/servertime', (req, res) => {
    const serverTime = new Date().toLocaleString()
    console.log(serverTime)
    res.send(`Server time is: ${serverTime}`)
})

app.use('/sitemap.xml', express.static('public/sitemap.xml'))
app.get('/robots.txt', express.static('public/robots.txt'))

app.get('/removed-users', authenticateToken, (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== 'admin') {
        return res.status(403).send('Not authorized')
    }
    res.json(removedUsers)
})

app.use('/user', userRoutes(transporter))
app.use('/blog', blogRoutes)
app.use('/event', eventRoutes)
app.use('/comment', commentRoutes(transporter))
app.use('/tag', tagRoutes)
app.use('/category', categoryRoutes)



app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).send('An error occurred: ' +  JSON.stringify(err))
})

cron.schedule('0 0 1 * *', async () => {
    jobId++
    jobs[jobId] = { status: 202, message: 'running user cleanup' }
    let users = await User.find({
        role: 'unverified-user',
        createdAt: {
            $lt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7)
        }})
    users.forEach(async (user) => {
        removedUsers.push(user)
        await user.remove()

    })
    jobs[jobId] = { status: 200, message: 'user cleanup successful' }
})

cron.schedule('10 11 * * 5', () => {
    jobId++
    jobs[jobId] = { status: 202, message: 'sending admin digest' }
    let date = new Date().toLocaleDateString()
    let text = `Admin Digest for ${date}\n`
    Comment.find({}).then((comments) => {
        text += `Comments: ${comments.length}\n`
        let flaggedComments = comments.filter((comment) => comment.flagged)
        text += `Flagged Comments: ${flaggedComments.length}\n`
        let visibleComments = comments.filter((comment) => comment.visible)
        text += `Visible Comments: ${visibleComments.length}\n`
        let hiddenComments = comments.filter((comment) => !comment.visible)
        text += `Hidden Comments: ${hiddenComments.length}\n`
        let newestComments = comments.sort((a, b) => b.date - a.date).slice(0, 3)
        text += `Newest Comments:\n`
        newestComments.forEach((comment) => {
            text += `${comment.content.substring(0, 300)}... \n`
        }
        )})
    text += '\n--------------------------------\n'
    Blog.find({}).then((blogs) => {
        text += `Blogs: ${blogs.length}\n`
        let newestBlogs = blogs.sort((a, b) => b.date - a.date).slice(0, 3)
        text += `Newest Blogs:\n`
        newestBlogs.forEach((blog) => {
            text += `${blog.title.substring(0, 300)}... \n`
        })
    })
    text += '\n--------------------------------\n'
    User.find({}).then((users) => {
        text += `Users: ${users.length}\n`
        let newestUsers = users.sort((a, b) => b.createdAt - a.createdAt).slice(0, 3)
        text += `Newest Users:\n`
        newestUsers.forEach((user) => {
            text += `${user.displayName} \n`
        })
        text += 'Users scheduled for removal:\n'
        users.filter((user) => user.role === 'unverified-user').forEach((user) => {
            text += `${user.displayName} \n`
        })
        text += 'Users removed:\n'
        removedUsers.forEach((user) => {
            text += `${user.displayName} \n`
        })
    })
    User.find({ role: 'admin' }).then((admins) => {
        admins.forEach((admin) => {
            const mailOptions = {
                from: process.env.EMAIL_FROM_USERNAME,
                to: admin.email,
                subject: 'Weekly Admin Digest',
                text: text,
            }
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error)
                } else {
                    console.log('Email sent: ' + info.response)
                }
            })
        })
    })
    jobs[jobId] = { status: 200, message: 'admin digest sent' }
})

cron.schedule('0 0 * * 0', () => {
    jobId++
    jobs[jobId] = { status: 202, message: 'running sitemap generator' }
    exec('cd ../frontend && npm run sitemap', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing sitemap generation: ${error.message}`)
            jobs[jobId] = { status: 500, message: 'Error executing sitemap generation', logFile: error.message }
            return
        }

        if (stderr) {
            console.error(`Error in sitemap generation: ${stderr}`)
            jobs[jobId] = { status: 500, message: 'Error in sitemap generation', logFile: stderr }
            return
        }

        console.log(`Sitemap generation output: ${stdout}`)
        jobs[jobId] = { status: 200, message: 'Sitemap generation successful' }
    })
})

app.listen(process.env.PORT, () => {
    console.log('Server is running on port ' + process.env.PORT)
})
