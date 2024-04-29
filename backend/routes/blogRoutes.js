import express from 'express'

import authenticateToken from '../middleware/authenticateToken.js'

import {getBlogs,
    getBlogsByCategory,
    getBlogsByAuthor,
    getBlogsByStatus,
    getBlogsByDate,
    getBlogBySlug,
    createBlog,
    editBlog,
    deleteBlog,
    addCommentToBlog,
    deleteCommentFromBlog,
    getBlogById,
    getBlogsByTag,
    unpublishBlog,
    publishBlog,
} from '../controllers/blogController.js'

const router = express.Router()

router.get('/', getBlogs)
router.get('/id/:id', getBlogById)
router.get('/tag/:tag', getBlogsByTag)
router.get('/category/:category', getBlogsByCategory)
router.get('/by/:author', getBlogsByAuthor)
router.post('/status', getBlogsByStatus)
router.post('/date', getBlogsByDate)
router.get('/slug/:slug', getBlogBySlug)
router.post('/create', authenticateToken, createBlog)
router.put('/edit/:id', authenticateToken, editBlog)
router.delete('/delete/:id', authenticateToken, deleteBlog)
router.put('/addcomment/:id', authenticateToken, addCommentToBlog)
router.put('/deletecomment/:id', authenticateToken, deleteCommentFromBlog)
router.post('/unpublish/:id', authenticateToken, unpublishBlog)
router.post('/publish/:id', authenticateToken, publishBlog)

export default router
