import express from 'express'
import asyncHandler from "../middleware/asyncHandler.js"
import Blog from '../models/blog.js'
import User from '../models/user.js'
import dotenv from 'dotenv'
import Comment from '../models/comment.js'
import {authenticateToken, lightAuthToken} from '../middleware/authenticateToken.js'

dotenv.config()

import {
    getCommentsByBlogPost,
    getCommentsByUser,
    getCommentById,
    createComment,
    deleteComment,
    getComments,
} from '../controllers/commentController.js'

const router = express.Router()

export default (transporter) => {
    router.get('/', authenticateToken, getComments)
    router.get('/blog/:id', lightAuthToken, getCommentsByBlogPost)
    router.get('/user/:id', getCommentsByUser)
    router.get('/id/:id', getCommentById)
    router.put('/unflag/:id', authenticateToken, asyncHandler(async (req, res) => {
        if (req.isAuthenticated()) {
            if (!req.user.role === 'admin' || !req.user.role === 'author') {
                return res.status(403).send('Not authorized')
            } else {
                const comment = await Comment.findById(req.params.id)
                if (comment) {
                    comment.flagged = false
                    comment.visible = true
                    await comment.save()
                    const mailOptions = {
                        from: process.env.EMAIL_FROM_USERNAME,
                        to: comment.user.email,
                        subject: 'Your comment has been unflagged',
                        text: 'Your comment has been unflagged and is now visible:\n ' + comment.content + "\n\nThis is an automated message, do not reply.",
                    }
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error)
                        } else {
                            console.log('Email sent: ' + info.response)
                        }
                    })
                    res.json(comment)
                } else {
                    res.status(404).send('Comment not found')
                }
            }
        } else {
            return res.status(403).send('Not authorized')
        }
    }))
    router.put('/flag/:id', authenticateToken, asyncHandler(async (req, res) => {
        if (req.isAuthenticated()) {
            if (req.user.role === 'unverified-user') {
                return res.status(403).send('Not authorized')
            } else {
                const comment = await Comment.findById(req.params.id)
                if (comment) {
                    comment.flagged = true
                    comment.visible = false
                    await comment.save()
                    const mailOptions = {
                        from: process.env.EMAIL_FROM_USERNAME,
                        to: comment.user.email,
                        subject: 'Your comment has been flagged',
                        text: 'Your comment has been flagged and is not currently visible:\n ' + comment.content + "\nIf you believe this was done in error, please contact the site administrator.\n\nThis is an automated message, do not reply.",
                    }
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error)
                        } else {
                            console.log('Email sent: ' + info.response)
                        }
                    })
                    res.json(comment)
                } else {
                    res.status(404).send('Comment not found')
                }
            }
        } else {
            return res.status(403).send('Not authorized')
        }
    }))
    router.post('/create', authenticateToken, createComment)
    router.delete('/delete/:id', authenticateToken, deleteComment)

    router.post('/reply/:id', authenticateToken, asyncHandler(async (req, res) => {
        if (req.isAuthenticated()) {
            if (req.user.role === 'unverified-user') {
                return res.status(403).send('Not authorized')
            } else {
                const comment = await Comment.findById(req.params.id).populate('user')
                if (comment) {
                    
                    const reply = new Comment({
                        content: req.body.content,
                        blogPost: comment.blogPost,
                        user: req.body.user,
                        date: new Date(),
                        visible: true,
                        replies: [],
                        nestedLevel: comment.nestedLevel + 1,
                    })
                    await reply.save()
                    comment.replies.push(reply._id)
                    await comment.save()

                    let replyUser = await User.findById(reply.user)
                    let commentUser = await User.findById(comment.user)

                    // Send email to the original commentor
                    let blogPost = await Blog.findById(comment.blogPost)
                    let blogUrl = blogPost.site + '/blog/' + blogPost.slug
                    let emailBody = `A new reply has been made to your comment on: <a href = ${blogUrl}}>${blogPost.title}</a> by ${replyUser.displayName}: ${reply.content}\nIf you find the reply interesting, you can reply to it and continue the conversation. If the reply is inappropriate, please flag it for review.\n\nThis is an automated message, do not reply.`
                    const mailOptions = {
                        from: process.env.EMAIL_FROM_USERNAME,
                        to: commentUser.email,
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