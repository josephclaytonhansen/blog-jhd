import db from './mongo.js'

import express from 'express'

import cors from 'cors'
import dotenv from 'dotenv'
import rate_limit from 'express-rate-limit'

import nodemailer from 'nodemailer'
import cron from 'node-cron'

import passport from 'passport'

import cookieParser from 'cookie-parser'

import userRoutes from './routes/userRoutes.js'

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

const app = express()

app.use(express.urlencoded({
    extended: false
}))
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET))


app.use(passport.initialize())

if (process.env.NODE_ENV === 'development') {
    app.use(cors({origin: `http://localhost:`+ process.env.PORT}))
}
else if (process.env.NODE_ENV === 'production') {
    app.use(cors({origin: process.env.FRONTEND_URL}))

}

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


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/api/user', userRoutes(transporter))

app.listen(process.env.PORT, () => {
    console.log('Server is running on port ' + process.env.PORT)
})