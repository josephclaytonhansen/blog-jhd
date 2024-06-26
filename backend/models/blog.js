import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema({
    content: Object,
    title: String,
    status: String,
    category: String,
    tags: Array,
    date: String,
    featuredImage: String,
    scheduledDate: String,
    slug: String,
    metaTitle: String,
    metaDescription: String,
    metaKeywords: String,
    excerpt: String,
    metaOpenGraph: Object,
    author: String,
    comments: Array,
    site: String,
    subDirectory: String,
    views: Number,
    headerStyle: String,
    sidebar: Boolean,
    messageBar: Boolean,
    messageBarContent: String,
    messageBarLink: String,
    messageBarLinkText: String,
    messageBarType: String,
})

blogSchema.pre('save', function(next) {
    this.slug = this.title.toLowerCase().split(' ').join('-').replace(/[?'!]/g, '')
    next()
})

const Blog = mongoose.model('blogs', blogSchema)

export default Blog