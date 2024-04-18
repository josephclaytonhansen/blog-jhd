import express from 'express'
import asyncHandler from "../middleware/asyncHandler.js"
import Blog from '../models/blog.js'

import {
    getCommentsByBlogPost,
    getCommentsByUser,
    getCommentById,
    getFlaggedComments,
    flagComment,
    createComment,
    deleteComment
} from '../controllers/commentController.js'

const router = express.Router()

export default (transporter) => {
    router.get('/blog/:id', getCommentsByBlogPost)
    router.get('/user/:id', getCommentsByUser)
    router.get('/id/:id', getCommentById)
    router.get('/flagged', getFlaggedComments)
    router.put('/flag/:id', flagComment)
    router.post('/create', createComment)
    router.delete('/delete/:id', deleteComment)

    router.post('/reply/:id', asyncHandler(async (req, res) => {
        if (req.isAuthenticated()) {
            if (req.user.role === 'unverified-user') {
                return res.status(403).send('Not authorized')
            } else {
                const comment = await Comment.findById(req.params.id).populate('user')
                if (comment) {
                    const reply = new Comment({
                        content: req.body.content,
                        blogPost: comment.blogPost,
                        user: req.body.user_id,
                        date: new Date(),
                        visible: true,
                        replies: [],
                        nestedLevel: comment.nestedLevel + 1,
                    })
                    await reply.save()
                    comment.replies.push(reply._id)
                    await comment.save()

                    // Send email to the original commentor
                    let blogPost = await Blog.findById(comment.blogPost)
                    let blogUrl = blogPost.site + '/blog/' + blogPost.slug
                    let emailBody = `A new reply has been made to your comment on: <a href = ${blogUrl}}>${blogPost.title}</a> by ${reply.user.displayName}: ${reply.content}`
                    const mailOptions = {
                        from: process.env.EMAIL_FROM_USERNAME,
                        to: comment.user.email,
                        subject: 'New reply to your comment on' + blogPost.site + ': ' + blogPost.title,
                        text: emailBody,
                    }
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });

                    res.json(comment)
                } else {
                    res.status(404).send('Comment not found')
                }
            }
        } else {
            return res.status(403).send('Not authorized')
        }
    }))

    return router
}