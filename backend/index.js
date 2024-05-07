import db from './mongo.js'
import User from './models/user.js'
import Tag from './models/tag.js'
import Comment from './models/comment.js'

import lusca from 'lusca'

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
import commentRoutes from './routes/commentRoutes.js'
import tagRoutes from './routes/tagRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'


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

const requests = []
const removedUsers = []

const app = express()
app.disable('x-powered-by')
app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal'])

var corsOptions = {    origin:['https://seabass.josephhansen.dev','seabass.josephhansen.dev','https://blog.josephhansen.dev','blog.josephhasen.dev','hansenstudios.art','https://hansenstudios.art'],   credentials:true, optionsSuccessStatus: 200,  }
app.use(cors(corsOptions));


app.use(express.urlencoded({
    extended: false
}))

dotenv.config()

app.use(express.json())

app.use(cookieParser(process.env.COOKIE_PARSER_SECRET))
app.use(lusca.csrf())
app.use(lusca.xframe('SAMEORIGIN'))

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

if (process.env.NODE_ENV === 'production') {
app.use(limiter)
}

const ipAddressToBase64 = (ip) => {
    return Buffer.from(ip.split('.').map((octet) => parseInt(octet)).join('.')).toString('base64')
}

app.use((req, res, next) => {
    res.setHeader('Referrer-Policy', 'no-referrer')
    requests.push({
        url: req.originalUrl,
        method: req.method,
        ip: ipAddressToBase64(req.ip),
        rate_limit: req.rateLimit,
        authenticated: req.isAuthenticated(),
        user: req.user,
    })
    next()
})

app.get('/', (req, res) => {
    res.send('Hello World!')
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
app.use('/comment', commentRoutes(transporter))
app.use('/tag', tagRoutes)
app.use('/category', categoryRoutes)

app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).send('An error occurred: ' + err.message)
})

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
