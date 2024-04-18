import asyncHandler from '../middleware/asyncHandler.js'
import User from '../models/user.js'
import {
    createToken,
    verifyToken
} from './jwt.js'
import jwt from 'jsonwebtoken'

const userLoginByEmail = asyncHandler(async (req, res) => {
    const user = await User.findOne({
        email: {
            $eq: req.body.email
        }
    })
    if (user && user.validPassword(req.body.password)) {
        user.lastLogin = new Date()
        await user.save()
        let auth_token = createToken(user)
        res.json({
            auth_token: auth_token,
            email: user.email
        })
    } else {
        res.status(401)
        throw new Error('Invalid credentials')
    }
})

const verifyTokenUser = asyncHandler(async (req, res, next) => {
    const token = req.body.token || req.query.token
    const user = req.body.user || req.query.user
    let decode = verifyToken(token)
    let user_json = JSON.parse(user)
    if (decode.email === user_json.user.email) {
        if (decode.exp - Date.now() / 1000 < 60 * 30) {
            //verify JWT signature 
            let signature = decode.signature
            let auth_secret = process.env.JWT_SECRET
            let signature_check = jwt.verify(token, auth_secret)
            if (signature_check.signature === signature) {
                res.status(200)
                res.json({
                    message: 'success'
                })
            } else {
                res.status(401)
                throw new Error('Invalid credentials')
            }
        }
    } else {
        res.status(401)
        throw new Error('Invalid credentials')
    }
})

const createUser = asyncHandler(async (req, res) => {
    let existingUser = await User.findOne({
        email: {
            $eq: req.body.email
        }
    } || {
        registeredIp: {
            $eq: req.ip
        }
    })
    if (existingUser) {
        res.status(401).message('User already exists')
    }
    if (req.body.password !== req.body.confirm_password) {
        res.status(401).message('Passwords do not match')
    }
    const user = new User({
        email: req.body.email,
        password: req.body.password,
        displayName: req.body.displayName,
        picture: "",
        shortBio: "",
        longBio: "",
        role: "unverified-user",
        displayEmail: "",
        website: "",
        lastLogin: new Date(),
        lastEdit: new Date(),
        posts: [],
        comments: [],
        registeredIp: req.ip,
        lastIp: req.ip,
        emailVerifyToken: user.generateEmailVerifyToken(),
    })
    await user.save()
    res.status(201).json(user)
})

const verifyEmailUser = asyncHandler(async (req, res) => {
    let token = req.query.token
    const user = await User.findOne({
        email: {
            $eq: req.query.email
        },
        emailVerifyToken: {
            $eq: token
        }
    })
    if (user) {
        user.role = 'user'
        user.verifiedEmail = true
        await user.save()
        res.status(200).send('Email verified')
    } else {
        res.status(401).send('Verification failed')
    }
})

const editUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user) {
        if (user.role !== 'unverified-user' && (req.user._id === user._id || req.user.role === 'admin')) {
            user.email = req.body.email || user.email
            user.password = req.body.password || user.password
            user.displayName = req.body.displayName || user.displayName
            user.picture = req.body.picture || user.picture
            user.shortBio = req.body.shortBio || user.shortBio
            user.longBio = req.body.longBio || user.longBio
            user.displayEmail = req.body.displayEmail || user.displayEmail
            user.website = req.body.website || user.website
            user.lastEdit = new Date()
            user.posts = req.body.posts || user.posts
            user.comments = req.body.comments || user.comments

            if (req.user.role === 'admin') {
                user.role = req.body.role || user.role
            } else {
                res.status(401).send('User role cannot be edited- insufficient permissions.')
            }
        } else {
            res.status(401)
            throw new Error('User cannot be edited- insufficient permissions.')
        }
        await user.save()
        if (req.user._id === user._id || req.user.role === 'admin') {
            res.json(user)
        } else {
            res.json({
                displayName: user.displayName,
                picture: user.picture,
                shortBio: user.shortBio,
                longBio: user.longBio,
                displayEmail: user.displayEmail,
                website: user.website,
                posts: user.posts,
                comments: user.comments
            })
        }
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

const addToUserPosts = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user) {
        user.posts.push(req.body.post_id)
        await user.save()
        res.json(user)
    }
})

const addToUserComments = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user) {
        user.comments.push(req.body.comment_id)
        await user.save()
        res.json(user)
    }
})

const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user && user.role !== "user") {
        await user.remove()
        res.json({
            message: 'User removed'
        })
    } else if (user && user.role === "user") {
        res.status(401)
        throw new Error('User cannot be deleted- insufficient permissions.')
    }
})

const randomString = (length) => {
    let result = ''
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let charactersLength = characters.length
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

const anonymizeUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user) {
        if (req.user._id === user._id || req.user.role === 'admin') {
            user.email = randomString(10) + '@' + randomString(5) + '.' + randomString(3)
            user.displayName = 'anon' + randomString(10)
            user.picture = ""
            user.shortBio = ""
            user.longBio = ""
            user.displayEmail = randomString(10) + '@' + randomString(5) + '.' + randomString(3)
            user.website = ""
            user.lastLogin = new Date()
            user.lastEdit = new Date()
            user.password = randomString(10)
            await user.save()
            res.json(user)
        }
    }
})

const getUserByDisplayName = asyncHandler(async (req, res) => {
    const user = await User.findOne({
        displayName: {
            $eq: req.params.displayName
        }
    })
    if (user) {
        res.json(user._id)
    }
})

const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user) {
        if (req.user._id === user._id || req.user.role === 'admin') {
            res.json(user)
        } else {
            res.json({
                displayName: user.displayName,
                picture: user.picture,
                shortBio: user.shortBio,
                longBio: user.longBio,
                displayEmail: user.displayEmail,
                website: user.website,
                posts: user.posts,
                comments: user.comments
            })
        }
    }
})

const getUserByEmail = asyncHandler(async (req, res) => {
    const user = await User.findOne({
        email: {
            $eq: req.params.email
        }
    })
    if (user) {
        if (req.user._id === user._id || req.user.role === 'admin') {
            res.json(user)
        } else {
            res.json({
                displayName: user.displayName,
                picture: user.picture,
                shortBio: user.shortBio,
                longBio: user.longBio,
                displayEmail: user.displayEmail,
                website: user.website,
                posts: user.posts,
                comments: user.comments
            })
        }
    }
})

export {
    userLoginByEmail,
    verifyTokenUser,
    createUser,
    editUser,
    deleteUser,
    anonymizeUser,
    addToUserPosts,
    addToUserComments,
    verifyEmailUser,
    getUserByDisplayName,
    getUserById,
    getUserByEmail
}