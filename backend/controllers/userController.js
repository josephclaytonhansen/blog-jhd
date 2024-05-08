import asyncHandler from '../middleware/asyncHandler.js'
import User from '../models/user.js'
import {
    createToken,
    verifyToken
} from './jwt.js'
import jwt from 'jsonwebtoken'

const ipAddressToBase64 = (ip) => {
    let step1 = Buffer.from(ip.split('.').map((octet) => parseInt(octet)).join('.')).toString('base64')
    return step1
}

const userLoginByEmail = asyncHandler(async (req, res) => {
    const user = await User.findOne({
        email: {
            $eq: req.body.email || req.body.username
        }
    })
    if (user && user.validPassword(req.body.password)) {
        user.lastLogin = new Date()
        user.lastIp = ipAddressToBase64(req.ip)
        user.session = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        user.sessionTimestamp = new Date().toISOString()
        await user.save()
        let auth_token = createToken(user)
        res.json({
            auth_token: auth_token,
            user: user,
        })
    } else {
        res.status(401)
        throw new Error('Invalid credentials')
    }
})

const checkSessionUser = asyncHandler(async (req, res) => {
    let user = JSON.parse(req.body.user.user || req.query.user.user)
    let session = req.body.session || req.query.session
    let userCheck = await User.findOne({ session: { $eq: session } })
    console.log(user._id, userCheck)
    if (userCheck._id.toString() === user._id) {
        if (Date.now() - new Date(userCheck.sessionTimestamp).getTime() < 15 * 60 * 1000) {
            res.status(200)
            res.json({
                message: userCheck.role
            })
        } else {
            res.status(401)
            throw new Error('Invalid session')
        }
    }
    else {
        res.status(401)
        throw new Error('Invalid session')
    }
})

const verifyTokenUser = asyncHandler(async (req, res, next) => {
    const token = req.body.token || req.query.token
    const user = req.body.user || req.query.user
    let decode = verifyToken(token)
    let user_json = JSON.parse(user)
    if (decode.email === user_json.user.email) {
        if (decode.exp - Date.now() / 1000 < 60 * 120) {
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

const isAdminUser = asyncHandler(async (req, res) => {
    const session = req.body.session || req.query.session
    const token = req.body.token || req.query.token
    const user = req.body.user || req.query.user
    if (!(user.session === session) && !(Date.now() - new Date(user.sessionTimestamp).getTime() < 15 * 60 * 1000)) {
        res.status(401)
        throw new Error('Invalid session')
    }
    let decode = verifyToken(token)
    let user_json = JSON.parse(user)
    if (decode.email === user_json.user.email) {
        if (decode.exp - Date.now() / 1000 < 60 * 120) {
            let signature = decode.signature
            let auth_secret = process.env.JWT_SECRET
            let signature_check = jwt.verify(token, auth_secret)
            if (signature_check.signature === signature) {
                if (user_json.user.role === 'admin') {
                    res.status(200)
                    res.json({
                        message: 'user is admin'
                    })
                } else {
                    res.status(401)
                    throw new Error('role failed')
                }
            } else {
                res.status(401)
                throw new Error('role failed')
            }
        } else {
            res.status(401)
            throw new Error('token expired')
        }
    } else {
        res.status(401)
        throw new Error('role failed')
    }
})

const isAuthorUser = asyncHandler(async (req, res) => {
    const token = req.body.token || req.query.token
    const user = req.body.user || req.query.user
    let decode = verifyToken(token)
    let user_json = JSON.parse(user)
    if (decode.email === user_json.user.email) {
        if (decode.exp - Date.now() / 1000 < 60 * 120) {
            let signature = decode.signature
            let auth_secret = process.env.JWT_SECRET
            let signature_check = jwt.verify(token, auth_secret)
            if (signature_check.signature === signature) {
                if (user_json.user.role === 'author') {
                    res.status(200)
                    res.json({
                        message: 'user is author'
                    })
                } else {
                    res.status(401)
                    throw new Error('role failed')
                }
            } else {
                res.status(401)
                throw new Error('role failed')
            }
        } else {
            res.status(401)
            throw new Error('token expired')
        }
    } else {
        res.status(401)
        throw new Error('role failed')
    }
})

const isVerifiedUser = asyncHandler(async (req, res) => {
    const token = req.body.token || req.query.token
    const user = req.body.user || req.query.user
    let decode = verifyToken(token)
    let user_json = JSON.parse(user)
    if (decode.email === user_json.user.email) {
        if (decode.exp - Date.now() / 1000 < 60 * 120) {
            let signature = decode.signature
            let auth_secret = process.env.JWT_SECRET
            let signature_check = jwt.verify(token, auth_secret)
            if (signature_check.signature === signature) {
                if (user_json.user.verifiedEmail === true) {
                    res.status(200)
                    res.json({
                        message: 'user is verified'
                    })
                } else {
                    res.status(401)
                    throw new Error('role failed')
                }
            } else {
                res.status(401)
                throw new Error('role failed')
            }
        } else {
            res.status(401)
            throw new Error('token expired')
        }
    } else {
        res.status(401)
        throw new Error('role failed')
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
        throw new Error('User already exists')
    } else {
        if (req.body.confirmPassword){
            if (req.body.password !== req.body.confirmPassword) {
                throw new Error('Passwords do not match')
        }
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
        registeredIp: ipAddressToBase64(req.ip),
        lastIp: ipAddressToBase64(req.ip),
        verifiedEmail: false
    })
    
    user.emailVerifyToken = user.generateEmailVerifyToken()
    
    try {
        await user.save()
        return user
    }
    catch (error) {
        throw new Error(error.message)
    }}
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
        user.emailVerifyToken = ''
        await user.save()
        res.status(200).send('Email verified')
    } else {
        res.status(401).send('Verification failed')
    }
})

const editUser = asyncHandler(async (req, res) => {
    if (!req.user){
        res.status(401)
        throw new Error('You must be logged in to edit a user.')
    } 
    const user = await User.findById(req.params.id)
    if (user) {
        if ((user.role !== 'unverified-user' && req.user._id === user._id) || req.user.role === 'admin') {
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
    if (!req.user){
        res.status(401)
        throw new Error('You must be logged in to anonymize a user.')
    } else if (req.user.role !== 'admin') {
        res.status(401)
        throw new Error('You must be an admin to anonymize a user.')
    }
    const user = await User.findById(req.params.id)
    if (user) {
        if (user.role == "admin"){
            res.status(403)
            throw new Error('Admin users cannot be anonymized')
        }
        try {
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
        }} catch (error) {
            throw new Error(error.message)
        }
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

const getUserByDisplayName = asyncHandler(async (req, res) => {
    const displayName = req.params.displayName.replace(/-/g, ' ');
    let sanitizedDisplayName = displayName.replace(/[^a-zA-Z0-9 ]/g, "")
    const user = await User.findOne({
        displayName: {
            $regex: new RegExp(`^${sanitizedDisplayName}$`, 'i')
        }
    })
    if (user) {
        if (req.user._id === user._id || req.user.role === 'admin') {
            console.log(user)
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
        res.status(404).send('User not found')
    }
})

const getUsers = asyncHandler(async (req, res) => {
    console.log(req.user)

    const users = await User.find({})

    if (!req.user){
        for (let i = 0; i < users.length; i++) {
            users[i].emailVerifyToken = ""
            users[i].lastIp = ""
            users[i].registeredIp = ""
            users[i].lastLogin = ""
            users[i].lastEdit = ""
            users[i].role = ""
        
        }
    } else {
    for (let i = 0; i < users.length; i++) {
        if (req.user._id !== users[i]._id && req.user.role !== 'admin') {
            users[i].emailVerifyToken = ""
            users[i].lastIp = ""
            users[i].registeredIp = ""
            users[i].lastLogin = ""
            users[i].lastEdit = ""
            users[i].role = ""
        }
    }} 
    res.json(users)
})

const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user) {
        console.log(user)
        let response = {
            displayName: user.displayName,
            picture: user.picture,
            shortBio: user.shortBio,
            longBio: user.longBio,
            displayEmail: user.displayEmail,
            website: user.website,
            posts: user.posts,
            comments: user.comments
        }
        if (req.user && (req.user._id === user._id || req.user.role === 'admin')) {
            response = user
        }
        res.json(response)
    } else {
        res.status(404).json({ message: 'User not found' })
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
    } else {
        res.status(404).send('User not found')
    }
})

export {
    userLoginByEmail,
    verifyTokenUser,
    isAdminUser,
    isVerifiedUser,
    isAuthorUser,
    createUser,
    editUser,
    deleteUser,
    anonymizeUser,
    addToUserPosts,
    addToUserComments,
    verifyEmailUser,
    getUserByDisplayName,
    getUserById,
    getUserByEmail,
    getUsers,
    checkSessionUser
}