import asyncHandler from "../middleware/asyncHandler.js"
import Category from "../models/category.js"

const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({})
    res.json(categories)
})

const getCategoryById = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id)
    if (category) {
        res.json(category)
    } else {
        res.status(404).send('Category not found')
    }
})

const getCategoryBySlug = asyncHandler(async (req, res) => {
    const category = await Category.findOne({slug: req.params.slug})
    if (category) {
        res.json(category)
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
    const category = new Category({
        name: req.body.name,
        site: req.body.site
    })
    await category.save()
    res.json(category)
})

const deleteCategory = asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(403).send('Not authorized')
    }
    if (!req.user.role === 'admin' || !req.user.role === 'author') {
        return res.status(403).send('Not authorized')
    }
    const category = await Category.findById(req.params.id)
    if (category) {
        await Category.deleteOne({ _id: {$eq:req.params.id} })
        res.json({ message: 'category removed' })
    } else {
        res.status(404).send('category not found')
    }
})

const editCategory = asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(403).send('Not authorized')
    }
    if (!req.user.role === 'admin' || !req.user.role === 'author') {
        return res.status(403).send('Not authorized')
    }
    const category = await Category.findById(req.params.id)
    if (category) {
        category.name = req.body.name || category.name
        category.site = req.body.site || category.site
        await category.save()
        res.json(category)
    } else {
        res.status(404).send('category not found')
    }
})

export { getCategories, editCategory, getCategoryById, createCategory, deleteCategory, getCategoryBySlug}