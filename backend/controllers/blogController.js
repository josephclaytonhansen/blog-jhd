import asyncHandler from '../middleware/asyncHandler.js'
import Blog from '../models/blog.js'

const getBlogs = asyncHandler(async (req, res) => {
    const blogs = await Blog.find({})
    res.json(blogs)
})
const getBlogsByCategory = asyncHandler(async (req, res) => {
    const blogs = await Blog.find({ category: {$eq:req.params.category} })
    res.json(blogs)
})
const getBlogsByAuthor = asyncHandler(async (req, res) => {
    const blogs = await Blog.find({ author: {$eq:req.params.author} })
    res.json(blogs)
})
const getBlogsByStatus = asyncHandler(async (req, res) => {
    const blogs = await Blog.find({ status: {$eq:req.body.status} })
    if (req.isAuthenticated()) {
        if (req.user.role === 'user' || req.user.role === 'unverified-user') {
            return res.status(403).send('Not authorized')
        } else {
            res.json(blogs)
        
        }
    } else {
        return res.status(403).send('Not authorized')
    }
})
const getBlogsByDate = asyncHandler(async (req, res) => {
    let startDate = new Date(req.body.start_date)
    let endDate = new Date(req.body.end_date)
    const blogs = await Blog.find({ date: {$gte:startDate, $lte:endDate} })
    res.json(blogs)
})
const getBlogBySlug = asyncHandler(async (req, res) => {
    const blog = await Blog.findOne({ slug: {$eq:req.params.slug} })
    res.json(blog)
})

const getBlogById = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id)
    if (blog) {
        res.json(blog)
    } else {
        res.status(404).send('Blog not found')
    }
})

const createBlog = asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(403).send('Not authorized')
    }
    if (req.user.role === 'user' || req.user.role === 'unverified-user') {
        return res.status(403).send('Not authorized')
    }
    const blog = new Blog({
        content: req.body.content,
        title: req.body.title,
        status: req.body.status,
        category: req.body.category,
        date: req.body.date,
        featuredImage: req.body.featuredImage,
        scheduledDate: req.body.scheduledDate,
        metaTitle: req.body.metaTitle,
        metaDescription: req.body.metaDescription,
        metaKeywords: req.body.metaKeywords,
        excerpt: req.body.excerpt,
        author: req.user.displayName,
        comments: [],
        site: req.protocol + '://' + req.get('host'),
    })
    await blog.save()
    res.status(201).json(blog)
})
const editBlog = asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(403).send('Not authorized')
    }
    if (req.user.role === 'user' || req.user.role === 'unverified-user') {
        return res.status(403).send('Not authorized')
    }
    const blog = await Blog.findById(req.params.id)
    if (blog) {
        blog.content = req.body.content || blog.content
        blog.title = req.body.title || blog.title
        blog.status = req.body.status || blog.status
        blog.category = req.body.category || blog.category
        blog.date = req.body.date || blog.date
        blog.featuredImage = req.body.featuredImage || blog.featuredImage
        blog.scheduledDate = req.body.scheduledDate || blog.scheduledDate
        blog.metaTitle = req.body.metaTitle || blog.metaTitle
        blog.metaDescription = req.body.metaDescription || blog.metaDescription
        blog.metaKeywords = req.body.metaKeywords || blog.metaKeywords
        blog.excerpt = req.body.excerpt || blog.excerpt
        blog.site = req.body.site || blog.site
        await blog.save()
        res.json(blog)
    } else {
        res.status(404).send('Blog not found')
    }
})
const deleteBlog = asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(403).send('Not authorized')
    }
    if (req.user.role === 'user' || req.user.role === 'unverified-user') {
        return res.status(403).send('Not authorized')
    }
    const blog = await Blog.findById(req.params.id)
    if (blog) {
        await blog.remove()
        res.json({ message: 'Blog removed' })
    } else {
        res.status(404).send('Blog not found')
    }
})
const addCommentToBlog = asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(403).send('Not authorized')
    }
    if (req.user.role === 'user' || req.user.role === 'unverified-user') {
        return res.status(403).send('Not authorized')
    }
    const blog = await Blog.findById(req.params.id)
    if (blog) {
        blog.comments.push(req.body.comment_id)
        await blog.save()
        res.json(blog)
    } else {
        res.status(404).send('Blog not found')
    }
})
const deleteCommentFromBlog = asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(403).send('Not authorized')
    }
    if (req.user.role === 'user' || req.user.role === 'unverified-user') {
        return res.status(403).send('Not authorized')
    }
    const blog = await Blog.findById(req.params.id)
    if (blog) {
        blog.comments = blog.comments.filter(comment => comment !== req.body.comment_id)
        await blog.save()
        res.json(blog)
    } else {
        res.status(404).send('Blog not found')
    }
})

const getBlogsByTag = asyncHandler(async (req, res) => {
    const blogs = await Blog.find({ tags: {$eq:req.params.tag} })
    res.json(blogs)
})

export {
    getBlogs,
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
    getBlogsByTag
}
