import express from 'express'

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
router.post('/create', createBlog)
router.put('/edit/:id', editBlog)
router.delete('/delete/:id', deleteBlog)
router.put('/addcomment/:id', addCommentToBlog)
router.put('/deletecomment/:id', deleteCommentFromBlog)
router.post('/unpublish/:id', unpublishBlog)
router.post('/publish/:id', publishBlog)

export default router
