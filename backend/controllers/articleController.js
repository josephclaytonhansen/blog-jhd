import asyncHandler from "../middleware/asyncHandler.js"
import Article from "../models/article.js"

const getArticles = asyncHandler(async (req, res) => {
    const articles = await Article.find({})
    res.json(articles)
})
const getArticleById = asyncHandler(async (req, res) => {
    const article = await Article.findById(req.params.id)
    if (article) {
        res.json(article)
    } else {
        res.status(404).send('Article not found')
    }
})
const getArticlesByCategory = asyncHandler(async (req, res) => {
    const articles = await Article.find({ category: {$eq:req.params.category} })
    res.json(articles)
})
const getArticlesByTag = asyncHandler(async (req, res) => {
    const articles = await Article.find({ tags: {$eq:req.params.tag} })
    res.json(articles)
})
const createArticle = asyncHandler(async (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.role === 'user' || req.user.role === 'unverified-user') {
            return res.status(403).send('Not authorized')
        } else {
            const article = new Article({
                content: req.body.content,
                title: req.body.title,
                status: req.body.status,
                category: req.body.category,
                tags: req.body.tags,
                featuredImage: req.body.featuredImage,
                metaTitle: req.body.metaTitle,
                metaDescription: req.body.metaDescription,
                metaKeywords: req.body.metaKeywords,
                excerpt: req.body.excerpt,
            })
            await article.save()
            res.json(article)
        }
    } else {
        return res.status(403).send('Not authorized')
    }
})
const updateArticle = asyncHandler(async (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.role === 'user' || req.user.role === 'unverified-user') {
            return res.status(403).send('Not authorized')
        } else {
            const article = await Article.findById(req.params.id)
            if (article) {
                article.content = req.body.content || article.content
                article.title = req.body.title || article.title
                article.status = req.body.status || article.status
                article.category = req.body.category || article.category
                article.tags = req.body.tags || article.tags
                article.featuredImage = req.body.featuredImage || article.featuredImage
                article.metaTitle = req.body.metaTitle || article.metaTitle
                article.metaDescription = req.body.metaDescription || article.metaDescription
                article.metaKeywords = req.body.metaKeywords || article.metaKeywords
                article.excerpt = req.body.excerpt || article.excerpt
                await article.save()
                res.json(article)
            } else {
                res.status(404).send('Article not found')
            }
        }
    } else {
        return res.status(403).send('Not authorized')
    }
})
const deleteArticle = asyncHandler(async (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.role === 'user' || req.user.role === 'unverified-user') {
            return res.status(403).send('Not authorized')
        } else {
            const article = await Article.findById(req.params.id)
            if (article) {
                await article.remove()
                res.json({ message: 'Article removed' })
            } else {
                res.status(404).send('Article not found')
            }
        }
    } else {
        return res.status(403).send('Not authorized')
    }
})

export { getArticles, getArticleById, getArticlesByCategory, getArticlesByTag, createArticle, updateArticle, deleteArticle }