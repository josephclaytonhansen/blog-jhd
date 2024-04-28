import { getTags, getTagById, createTag, deleteTag } from "../controllers/tagController.js"
import express from "express"

const router = express.Router()

router.get('/', getTags)
router.get('/:id', getTagById)
router.post('/', createTag)
router.delete('/:id', deleteTag)

export default router