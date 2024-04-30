import mongoose, { Mongoose } from 'mongoose'

const commentSchema = new mongoose.Schema({
    content: String,
    date: Date,
    user: String,
    visible: Boolean,
    replies: Array,
    nestedLevel: Number,
    blogPost: String,
    flagged: Boolean,
})

const Comment = mongoose.model('comments', commentSchema)

export default Comment