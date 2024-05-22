import { Router } from 'express'
import {
  getCategories,
  getCategoryByID,
  updateCategory,
  createCategory,
  deleteCategory
} from '../../middleware/category.js'
import { sanitizeReqBody } from '../../middleware/util.js'
import { renderSettingsCategories, renderSettingsEditCategory } from '../../controllers/category.js'

export const categoryRouter = Router()

categoryRouter.get('/', getCategories, renderSettingsCategories)
// get service assignment by ID and render edit page
categoryRouter.get(
  '/edit/:id', // target
  getCategoryByID,
  renderSettingsEditCategory
)
// update service assignment
categoryRouter.post(
  '/edit', // target
  sanitizeReqBody,
  updateCategory,
  renderSettingsCategories
)
// add new service assignment
categoryRouter.post('/create',
  sanitizeReqBody,
  createCategory,
  getCategories,
  renderSettingsCategories
)
// delete service assignment
categoryRouter.get('/delete/:id',
  deleteCategory,
  getCategories,
  renderSettingsCategories)
