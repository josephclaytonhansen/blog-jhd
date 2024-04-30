import mongoose from "mongoose"

const categorySchema = new mongoose.Schema({
    name: String,
    slug: String,
})

categorySchema.pre("save", function(next) {
    this.slug = this.name.toLowerCase().split(" ").join("-")
    next()
})

const Category = mongoose.model("categories", categorySchema)

export default Category