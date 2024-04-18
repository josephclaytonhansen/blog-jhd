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
    getUserByEmail
} from '../controllers/userController.js'

const router = express.Router()

export default (transporter) => {
    router.post('/login', userLoginByEmail)
    router.post('/verify', verifyTokenUser)
    router.post('/create', (req, res) => {
        let user = createUser(req, res)
        let token = user.emailVerifyToken
        let url = req.protocol + '://' + req.get('host')
        const mailOptions = {
            from: process.env.EMAIL_FROM_USERNAME,
            to: user.email,
            subject: 'Please verify your email',
            text: 'Please verify your email by clicking the following link: <a href = "' 
                + url
                + '/api/user/verifyemail?token=' + token 
                + '&email=' + encodeURIComponent(user.email)
                + '">Verify Email</a>\nIf you did not create an account on hansenstudios.art or blog.josephhansen.dev, please ignore this email.'
                + '\n\nThis is an automated message, do not reply.'
        }
        
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log(error)
            } else {
            console.log('Email sent: ' + info.response)
            }
        })
        
        res.status(200).send('User created')
    })
    router.put('/edit/:id', editUser)
    router.put('/addcomment/:id', addToUserComments)
    router.put('/addpost/:id', addToUserPosts)
    router.delete('/delete/:id', deleteUser)
    router.put('/anonymize/:id', anonymizeUser)
    router.get('/verifyemail', verifyEmailUser)
    router.get('/user/:displayName', getUserByDisplayName)
    router.get('/id/:id', getUserById)
    router.get('/email/:email', getUserByEmail)

    return router
}