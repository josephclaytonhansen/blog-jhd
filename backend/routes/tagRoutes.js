import { getTags, getTagById, createTag, deleteTag, editTag } from "../controllers/tagController.js"
import express from "express"
import {authenticateToken, lightAuthToken} from '../middleware/authenticateToken.js'

const router = express.Router()

router.get('/', getTags)
router.get('/:id', getTagById)
router.post('/', authenticateToken, createTag)
router.delete('/:id', authenticateToken, deleteTag)
router.put('/:id', authenticateToken, editTag)

export default router