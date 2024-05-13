import asyncHandler from "../middleware/asyncHandler.js"
import Tag from "../models/tag.js"

const getTags = asyncHandler(async (req, res) => {
    const tags = await Tag.find({})
    res.json(tags)
})

const getTagById = asyncHandler(async (req, res) => {
    const tag = await Tag.findById(req.params.id)
    if (tag) {
        res.json(tag)
    } else {
        res.status(404).send('Tag not found')
    }
})

const getTagBySlug = asyncHandler(async (req, res) => {
    const tag = await Tag.findOne({slug: req.params.slug})
    if (tag) {
        res.json(tag)
    } else {
        res.status(404).send('Tag not found')
    }
})

const createTag = asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(403).send('Not authorized')
    }
    if (!req.user.role === 'admin' || !req.user.role === 'author') {
        return res.status(403).send('Not authorized')
    }
    const tag = new Tag({
        name: req.body.name,
        site: req.body.site
    })
    await tag.save()
    res.json(tag)
})

const deleteTag = asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(403).send('Not authorized')
    }
    if (!req.user.role === 'admin' || !req.user.role === 'author') {
        return res.status(403).send('Not authorized')
    }
    const tag = await Tag.findById(req.params.id)
    if (tag) {
        await Tag.deleteOne({ _id: {$eq:req.params.id} })
        res.json({ message: 'Tag removed' })
    } else {
        res.status(404).send('Tag not found')
    }
})

const editTag = asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(403).send('Not authorized')
    }
    if (!req.user.role === 'admin' || !req.user.role === 'author') {
        return res.status(403).send('Not authorized')
    }
    const tag = await Tag.findById(req.params.id)
    if (tag) {
        tag.name = req.body.name
        tag.site = req.body.site
        await tag.save()
        res.json(tag)
    } else {
        res.status(404).send('Tag not found')
    }
})

export { getTags, getTagById, createTag, deleteTag, editTag, getTagBySlug }