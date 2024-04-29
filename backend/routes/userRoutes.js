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
    isAdminUser,
    isVerifiedUser
} from '../controllers/userController.js'

import authenticateToken from '../middleware/authenticateToken.js'

const router = express.Router()

export default (transporter) => {
    router.get('/', authenticateToken, getUsers)
    router.post('/login', userLoginByEmail)
    router.post('/verify', verifyTokenUser)
    router.post('/isadmin', isAdminUser)
    router.post('/isverified', isVerifiedUser)
    router.post('/create', authenticateToken, async (req, res) => {
        try {
            let user = await createUser(req)
            let token = user.emailVerifyToken
            // TODO: Update localhost to production domain
            let text =  'Please verify your email by clicking the following link: <a href = "' 
            + 'http://localhost:3720/user/verifyemail?token=' + token 
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
    router.get('/user/:displayName', getUserByDisplayName)
    router.get('/id/:id', authenticateToken, getUserById)
    router.get('/email/:email', getUserByEmail)

    return router
}