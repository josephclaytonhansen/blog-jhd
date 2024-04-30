import express from "express"
import { getCategories, getCategoryById, createCategory, deleteCategory, editCategory } from "../controllers/categoryController.js"
import {authenticateToken, lightAuthToken} from '../middleware/authenticateToken.js'
const router = express.Router()

router.get('/', getCategories)
router.get('/:id', getCategoryById)
router.post('/', authenticateToken, createCategory)
router.delete('/:id', authenticateToken, deleteCategory)
router.put('/:id', authenticateToken, editCategory)

export default router