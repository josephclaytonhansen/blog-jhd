import asyncHandler from "../middleware/asyncHandler"
import Comment from "../models/comment"

const getCommentsByBlogPost = asyncHandler(async (req, res) => {
    const comments = await Comment.find({
        blogPost: {
            $eq: req.params.id
        }
    })
    res.json(comments)
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

const getFlaggedComments = asyncHandler(async (req, res) => {
    const comments = await Comment.find({
        flagged: {
            $eq: true
        }
    })
    res.json(comments)
})

const flagComment = asyncHandler(async (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.role === 'unverified-user') {
            return res.status(403).send('Not authorized')
        } else {
            const comment = await Comment.findById(req.params.id)
            if (comment) {
                comment.flagged = true
                comment.visible = false
                await comment.save()
                res.json(comment)
            } else {
                res.status(404).send('Comment not found')
            }
        }
    } else {
        return res.status(403).send('Not authorized')
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
                user: req.body.user_id,
                date: new Date(),
                visible: true,
                replies: [],
                nestedLevel: 0,

            })
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
                    await comment.remove()
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


export {
    getCommentsByBlogPost,
    getCommentsByUser,
    getCommentById,
    getFlaggedComments,
    flagComment,
    createComment,
    deleteComment,
}