import db from './mongo.js'
import User from './models/user.js'

import express from 'express'

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
import articleRoutes from './routes/articleRoutes.js'
import commentRoutes from './routes/commentRoutes.js'

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

const startUpTime = new Date().getTime()
let requestCount = 0
const requests = []
const removedUsers = []

const app = express()
app.disable('x-powered-by')

app.use(express.urlencoded({
    extended: false
}))

// TODO: Add middleware to get nuxt-auth session data and set it to req.user

app.use(cookieParser(process.env.COOKIE_PARSER_SECRET))


app.use(passport.initialize())

const frontendUrls = process.env.FRONTEND_URLS.split(',')
app.use(cors({origin: frontendUrls}))

passport.serializeUser(async function (user, done) {
    done(null, user.id)
})

passport.deserializeUser(function (id, done) {
    User.findById(id).then((user) => {
        done(null, user)
    })
})

dotenv.config()

app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))

const limiter = rate_limit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
})


app.use(limiter)

app.use((req, res, next) => {
    requestCount++
    res.setHeader('Referrer-Policy', 'no-referrer')
    requests.push({
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        rate_limit: req.rateLimit,
        authenticated: req.isAuthenticated(),
        user: req.user,
    })
    next()
})

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/health', (req, res) => {
    let r = {
        "database": db.readyState === 1 ? "connected" : "disconnected",
        "server": "running",
        "uptime": (new Date().getTime() - startUpTime) / 1000 /60,
        "secure": req.secure,
        "ip": req.ip,
        "request count": requestCount,
        "authenticated": req.isAuthenticated(),
        "user": req.user,
        "host": req.headers.host,
    }
    res.send(r)
})

app.get('/requests', (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== 'admin') {
        return res.status(403).send('Not authorized')
    }
    res.json(requests)
})

app.get('/removed-users', (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== 'admin') {
        return res.status(403).send('Not authorized')
    }
    res.json(removedUsers)
})

app.use('/user', userRoutes(transporter))
app.use('/blog', blogRoutes)
app.use('/event', eventRoutes)
app.use('/article', articleRoutes)
app.use('/comment', commentRoutes(transporter))

cron.schedule('0 0 * * 0', async () => {
    console.log('Clearing requests')
    requests = []
})

cron.schedule('0 0 1 * *', async () => {
    console.log('Pruning unverified users')
    let users = await User.find({
        role: 'unverified-user',
        createdAt: {
            $lt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7)
        }})
    users.forEach(async (user) => {
        console.log('Removing user ' + user.displayName)
        removedUsers.push(user)
        await user.remove()

    })
})

app.listen(process.env.PORT, () => {
    console.log('Server is running on port ' + process.env.PORT)
})
// TODO: move to blogapi.josephhansen.dev
// TODO: upload to DO
// TODO: configure Nginx

// TODO: update ENV for production