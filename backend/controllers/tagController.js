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

const createTag = asyncHandler(async (req, res) => {
    const tag = new Tag({
        name: req.body.name,
    })
    await tag.save()
    res.json(tag)
})

const deleteTag = asyncHandler(async (req, res) => {
    const tag = await Tag.findById(req.params.id)
    if (tag) {
        await tag.remove()
        res.json({ message: 'Tag removed' })
    } else {
        res.status(404).send('Tag not found')
    }
})

export { getTags, getTagById, createTag, deleteTag }