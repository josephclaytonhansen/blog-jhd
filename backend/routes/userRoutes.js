import express from 'express'
import {
    userLoginByEmail,
    verifyTokenUser,
    createUser,
    editUser,
    deleteUser,
    anonymizeUser,
    addToUserComments,
    addToUserPosts,
    verifyEmailUser,
    getUserByDisplayName,
    getUserById,
    getUserByEmail,
    getUsers,
    isVerifiedUser,
    checkSessionUser
} from '../controllers/userController.js'

import {authenticateToken, lightAuthToken} from '../middleware/authenticateToken.js'

const router = express.Router()

import dotenv from 'dotenv'
dotenv.config()

export default (transporter) => {
    router.get('/', authenticateToken, getUsers)
    router.post('/login', async (req, res) => {
        req.transporter = transporter
        await userLoginByEmail(req, res)
    })
    router.post('/verify', verifyTokenUser)
    router.post('/checksession', checkSessionUser)
    router.post('/isverified', isVerifiedUser)
    router.post('/create', async (req, res) => {
        try {
            let user = await createUser(req)
            let token = user.emailVerifyToken
            let text =  'Please verify your email by clicking the following link: <a href = "' 
            + `${process.env.VUE_APP_SERVER_URL}/user/verifyemail?token=` + token 
            + '&email=' + encodeURIComponent(user.email)
            + '">Verify Email</a>\nIf you did not create an account on hansenstudios.art or blog.josephhansen.dev, please ignore this email.'
            + '\n\nThis is an automated message, do not reply.'
            console.log(text)
            try {
            const mailOptions = {
                from: process.env.EMAIL_FROM_USERNAME,
                to: user.email,
                subject: 'Please verify your email',
                text: text,
            }
            
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            })} catch (error) {
                console.error(error)
            }
            
            res.status(200).send('User created')
        } catch (error) {
            console.error(error)
            res.status(500).json({message: error.message})
        }
    })
    router.put('/edit/:id', authenticateToken, editUser)
    router.put('/addcomment/:id', authenticateToken, addToUserComments)
    router.put('/addpost/:id', authenticateToken, addToUserPosts)
    router.delete('/delete/:id', authenticateToken, deleteUser)
    router.put('/anonymize/:id', authenticateToken, anonymizeUser)
    router.get('/verifyemail', verifyEmailUser)
    router.get('/displayname/:displayName', lightAuthToken, getUserByDisplayName)
    router.get('/id/:id', lightAuthToken, getUserById)
    router.get('/email/:email', getUserByEmail)

    return router
}