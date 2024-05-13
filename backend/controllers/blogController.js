import asyncHandler from '../middleware/asyncHandler.js'
import Blog from '../models/blog.js'
import Tag from '../models/tag.js'
import User from '../models/user.js'

const getBlogs = asyncHandler(async (req, res) => {
    const blogs = await Blog.find({})
    res.json(blogs)
})
const getBlogsByCategory = asyncHandler(async (req, res) => {
    const blogs = await Blog.find({ category: {$eq:req.params.category} })
    blogs.forEach(blog => {
        blog.views = blog.views + 1
        blog.save()
    })
    res.json(blogs)
})
const getBlogsByAuthor = asyncHandler(async (req, res) => {
    const blogs = await Blog.find({ author: {$eq:req.params.author} })
    blogs.forEach(blog => {
        blog.views = blog.views + 1
        blog.save()
    })
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
    blog.views = blog.views + 1
    await blog.save()
    res.json(blog)
})

const getBlogById = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id)
    let sentUser = req.isAuthenticated() ? req.user._id : null
    let user = await User.findById(sentUser)
    blog.views = blog.views + 1
    await blog.save()
    if (blog) {
    let published = blog.status === 'published' ? true : false
    if (published || user.role === 'admin' || user.role === 'author') {
        res.json(blog)
    } else {
        res.status(403).send('Not authorized')
    }} else {
        res.status(404).send('Blog not found')
    }
    
    
})

const incrementBlogViews = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id)
    if (blog) {
        blog.views = blog.views + 1
        await blog.save()
        res.status(200).send('Views incremented')
    } else {
        res.status(404).send('Blog not found')
    }
})

const createBlog = asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(403).send('Not authorized')
    }
    if (!req.user.role === 'admin' || !req.user.role === 'author') {
        return res.status(403).send('Not authorized')
    }
    console.log(req.body)
    const blog = new Blog({
        content: req.body.content,
        title: req.body.title,
        status: req.body.status,
        category: req.body.category,
        date: new Date().toISOString(),
        featuredImage: req.body.featuredImage,
        scheduledDate: req.body.scheduledDate,
        metaTitle: req.body.metaTitle,
        metaDescription: req.body.metaDescription,
        metaKeywords: req.body.metaKeywords,
        metaOpenGraph: req.body.metaOpenGraph,
        excerpt: req.body.excerpt,
        author: req.user._id,
        comments: [],
        views: 0,
        site: req.body.site,
        subDirectory: req.subDirectory,
        headerStyle: req.body.headerStyle || 'image',
        sidebar: req.body.sidebar,
        tags: req.body.tags
    })
    await blog.save()
    res.status(201).json(blog)
})
const editBlog = asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(403).send('Not authorized')
    }
    if (!req.user.role === 'admin' || !req.user.role === 'author') {
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
        blog.metaOpenGraph = req.body.metaOpenGraph || blog.metaOpenGraph
        blog.excerpt = req.body.excerpt || blog.excerpt
        blog.site = req.body.site || blog.site
        blog.subDirectory = req.body.subDirectory || blog.subDirectory
        blog.headerStyle = req.body.headerStyle || blog.headerStyle
        blog.sidebar = req.body.sidebar === false || req.body.sidebar === true ? req.body.sidebar : blog.sidebar
        blog.tags = req.body.tags || blog.tags
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
    if (!req.user.role === 'admin' || !req.user.role === 'author') {
        return res.status(403).send('Not authorized')
    }
    const blog = await Blog.findById(req.params.id)
    if (blog) {
        await Blog.deleteOne({ _id: req.params.id })
        res.json({ message: 'Blog removed' })
    } else {
        res.status(404).send('Blog not found')
    }
})
const addCommentToBlog = asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(403).send('Not authorized')
    }
    if (req.user.role === 'unverified-user') {
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
    if (!req.user.role === 'admin' || !req.user.role === 'author') {
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
    console.log(req.params.tag)
    const blogs = await Blog.find({ tags: { $in: [req.params.tag] } })
    blogs.forEach(blog => {
        blog.views = blog.views + 1
        blog.save()
    })
    console.log(blogs)
    if (!blogs){
        res.status(404)
        throw new Error('Blogs not found')
    }
    res.json(blogs)
})

const publishBlog = asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(403).send('Not authorized')
    }
    if (!req.user.role === 'admin' || !req.user.role === 'author') {
        return res.status(403).send('Not authorized')
    }
    const blog = await Blog.findById(req.params.id)
    if (blog) {
        blog.status = 'published'
        await blog.save()
        res.json(blog)
    } else {
        res.status(404).send('Blog not found')
    }
})

const unpublishBlog = asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(403).send('Not authorized')
    }
    if (!req.user.role === 'admin' || !req.user.role === 'author') {
        return res.status(403).send('Not authorized')
    }
    const blog = await Blog.findById(req.params.id)
    if (blog) {
        blog.status = 'draft'
        await blog.save()
        res.json(blog)
    } else {
        res.status(404).send('Blog not found')
    }
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
    getBlogsByTag,
    publishBlog,
    unpublishBlog,
    incrementBlogViews
}
