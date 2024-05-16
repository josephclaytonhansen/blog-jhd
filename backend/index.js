import db from './mongo.js'
import User from './models/user.js'
import Tag from './models/tag.js'
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

app.post('/build', [buildLimiter, authenticateToken], async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== 'admin') {
        return res.status(403).send('Not authorized')
    }
    jobId++
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

app.use('/sitemap.xml', express.static('public/sitemap.xml'))

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
    let users = await User.find({
        role: 'unverified-user',
        createdAt: {
            $lt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7)
        }})
    users.forEach(async (user) => {
        removedUsers.push(user)
        await user.remove()

    })
})

cron.schedule('0 0 * * 0', () => {
    exec('cd ../frontend && npm run sitemap', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing sitemap generation: ${error.message}`)
            return
        }

        if (stderr) {
            console.error(`Error in sitemap generation: ${stderr}`)
            return
        }

        console.log(`Sitemap generation output: ${stdout}`)
    })
})

app.listen(process.env.PORT, () => {
    console.log('Server is running on port ' + process.env.PORT)
})
