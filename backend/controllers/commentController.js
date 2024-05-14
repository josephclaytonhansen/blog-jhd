import asyncHandler from "../middleware/asyncHandler.js"
import Comment from "../models/comment.js"
import User from "../models/user.js"

const getCommentsByBlogPost = asyncHandler(async (req, res) => {
    let sentUser = req.body.user || req.user
    console.log(sentUser)
    try{
    let user = await User.findById(sentUser._id)
    console.log(user)
    if (user){
        if (user.role === 'admin'){
            let comments = await Comment.find({
                blogPost: {
                    $eq: req.params.id
                }
            })
            res.json(comments)
        } else {
            let comments = await Comment.find({
                blogPost: {
                    $eq: req.params.id
                },
                visible: {
                    $eq: true
                }
            })
            res.json(comments)
        }
    } else {
        let comments = await Comment.find({
            blogPost: {
                $eq: req.params.id
            },
            visible: {
                $eq: true
            }
        })
        res.json(comments)
    }} catch (error){
        console.log(error)
        let comments = await Comment.find({
            blogPost: {
                $eq: req.params.id
            },
            visible: {
                $eq: true
            }
        })
        res.json(comments)
    }
})
const getCommentsByUser = asyncHandler(async (req, res) => {
    const comments = await Comment.find({
        user: {
            $eq: req.params.id
        }
    })
    res.json(comments)
})

const getCommentById = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id)
    if (comment) {
        res.json(comment)
    } else {
        res.status(404).send('Comment not found')
    }
})

const createComment = asyncHandler(async (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.role === 'unverified-user') {
            return res.status(403).send('Not authorized')
        } else {
            const comment = new Comment({
                content: req.body.content,
                blogPost: req.body.blogPost,
                user: req.body.user,
                date: new Date(),
                visible: true,
                replies: [],
                nestedLevel: 0,
                parent: req.body.parent,

            })
            let commentUser = await User.findById(req.body.user)
            comment.user = comment.user + '.' + commentUser.displayName
            await comment.save()
            res.json(comment)
        }
    } else {
        return res.status(403).send('Not authorized')
    }
})
const deleteComment = asyncHandler(async (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.role === 'unverified-user') {
            return res.status(403).send('Not authorized')
        } else {
            const comment = await Comment.findById(req.params.id)

            if (comment) {
                if (req.user.email === comment.user || req.user.role === 'admin') {
                    await Comment.deleteOne({
                        _id: req.params.id
                    })
                    res.json({
                        message: 'Comment removed'
                    })
                }

            } else {
                res.status(404).send('Comment not found')
            }
        }
    } else {
        return res.status(403).send('Not authorized')
    }
})

const getComments = asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(403).send('Not authorized')
    } else {
        if (req.user.role === 'admin') {
            const comments = await Comment.find({})
            res.json(comments)
        }
    }
})


export {
    getCommentsByBlogPost,
    getCommentsByUser,
    getCommentById,
    createComment,
    deleteComment,
    getComments
}