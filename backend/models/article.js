import mongoose from 'mongoose'

const articleSchema = new mongoose.Schema({
    content: Object,
    title: String,
    status: String,
    category: String,
    tags: Array,
    featuredImage: String,
    slug: String,
    metaTitle: String,
    metaDescription: String,
    metaKeywords: String,
    excerpt: String,
})

articleSchema.pre('save', function(next) {
    this.slug = this.title.toLowerCase().split(' ').join('-')
    next()
})

const Article = mongoose.model('articles', articleSchema)

export default Article