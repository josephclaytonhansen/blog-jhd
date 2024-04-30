import asyncHandler from "../middleware/asyncHandler.js"
import Category from "../models/category.js"

const getCategories = asyncHandler(async (req, res) => {
    const tags = await Category.find({})
    res.json(tags)
})

const getCategoryById = asyncHandler(async (req, res) => {
    const tag = await Category.findById(req.params.id)
    if (tag) {
        res.json(tag)
    } else {
        res.status(404).send('Category not found')
    }
})

const createCategory = asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(403).send('Not authorized')
    }
    if (!req.user.role === 'admin' || !req.user.role === 'author') {
        return res.status(403).send('Not authorized')
    }
    const tag = new Category({
        name: req.body.name,
    })
    await tag.save()
    res.json(tag)
})

const deleteCategory = asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(403).send('Not authorized')
    }
    if (!req.user.role === 'admin' || !req.user.role === 'author') {
        return res.status(403).send('Not authorized')
    }
    const tag = await Category.findById(req.params.id)
    if (tag) {
        await Category.deleteOne({ _id: {$eq:req.params.id} })
        res.json({ message: 'Tag removed' })
    } else {
        res.status(404).send('Tag not found')
    }
})

const editCategory = asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(403).send('Not authorized')
    }
    if (!req.user.role === 'admin' || !req.user.role === 'author') {
        return res.status(403).send('Not authorized')
    }
    const tag = await Category.findById(req.params.id)
    if (tag) {
        tag.name = req.body.name
        await tag.save()
        res.json(tag)
    } else {
        res.status(404).send('Tag not found')
    }
})

export { getCategories, editCategory, getCategoryById, createCategory, deleteCategory}