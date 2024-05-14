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
                    let commentUserId = comment.user.split('.')[0]
                    let commentUser = await User.findById(commentUserId)
                    const mailOptions = {
                        from: process.env.EMAIL_FROM_USERNAME,
                        to: commentUser.email,
                        subject: 'Your comment has been unflagged',
                        html: 'Your comment has been unflagged and is now visible:<br/> ' + comment.content + "<br/><br/>This is an automated message, do not reply.",
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
                    let commentUserId = comment.user.split('.')[0]
                    let commentUser = await User.findById(commentUserId)
                    const mailOptions = {
                        from: process.env.EMAIL_FROM_USERNAME,
                        to: commentUser.email,
                        subject: 'Your comment has been flagged',
                        html: 'Your comment has been flagged and is not currently visible:<br/> ' + comment.content + "<br/>If you believe this was done in error, please contact the site administrator.<br/><br/>This is an automated message, do not reply.",
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
                        user: req.body.user.indexOf('.') === -1 ? req.body.user : req.body.user.split('.')[0],
                        date: new Date(),
                        visible: true,
                        replies: [],
                        nestedLevel: comment.nestedLevel + 1,
                    })
                    await reply.save()
                    comment.replies.push(reply._id)
                    await comment.save()
                    let replyUserId, replyUser
                    if (reply.user.indexOf('.') === -1){
                        replyUserId = reply.user
                        replyUser = await User.findById(replyUserId)
                        reply.user = reply.user + '.' + replyUser.displayName
                    } else {
                        replyUserId = reply.user.split('.')[0]
                    }
                    let commentUserId = comment.user.split('.')[0]
                    let commentUser = await User.findById(commentUserId)
                    
                    await reply.save()

                    // Send email to the original commentor
                    let blogPost = await Blog.findById(comment.blogPost)
                    let blogUrl = 'https://' + blogPost.site + '/p/' + blogPost.slug
                    let emailBody = `A new reply has been made to your comment on: <a href = ${blogUrl}>${blogPost.title}</a> by ${replyUser.displayName}: ${reply.content}<br/>If you find the reply interesting, you can reply to it and continue the conversation. If the reply is inappropriate, please flag it for review.<br/><br/>This is an automated message, do not reply.`
                    const mailOptions = {
                        from: process.env.EMAIL_FROM_USERNAME,
                        to: commentUser.email,
                        subject: 'New reply to your comment on' + blogPost.site + ': ' + blogPost.title,
                        html: emailBody,
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