import mongoose from "mongoose"

const tagSchema = new mongoose.Schema({
    name: String,
    slug: String,
})

tagSchema.pre("save", function(next) {
    this.slug = this.name.toLowerCase().split(" ").join("-")
    next()
})

const Tag = mongoose.model("tags", tagSchema)

export default Tag