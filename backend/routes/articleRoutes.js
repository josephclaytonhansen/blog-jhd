import express from 'express'

import {
    getArticles, getArticleById, getArticlesByCategory, getArticlesByTag, createArticle, updateArticle, deleteArticle
} from '../controllers/articleController.js'

const router = express.Router()

router.get('/', getArticles)
router.get('/id/:id', getArticleById)
router.get('/category/:category', getArticlesByCategory)
router.get('/tag/:tag', getArticlesByTag)
router.post('/create', createArticle)
router.put('/edit/:id', updateArticle)
router.delete('/delete/:id', deleteArticle)

export default router