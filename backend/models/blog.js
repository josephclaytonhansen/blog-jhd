import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema({
    content: Object,
    title: String,
    status: String,
    category: String,
    date: String,
    featuredImage: String,
    scheduledDate: String,
    slug: String,
    metaTitle: String,
    metaDescription: String,
    metaKeywords: String,
    excerpt: String,
})

blogSchema.pre('save', function(next) {
    this.slug = this.title.toLowerCase().split(' ').join('-')
    next()
})

const Blog = mongoose.model('blogSchema', blogSchema)

export default Blog