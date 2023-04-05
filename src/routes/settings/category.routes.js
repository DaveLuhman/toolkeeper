import { Router } from 'express'
import {
  getCategories,
  getCategoryByID,
  updateCategory,
  createCategory,
  deleteCategory
} from '../../middleware/category.js'
import { sanitizeReqBody } from '../../middleware/util.js'

export const categoryRouter = Router()

categoryRouter.get('/', getCategories, (_req, res) => {
  res.render('settings/categories')
})
// get service assignment by ID and render edit page
categoryRouter.get(
  '/edit/:id', // target
  getCategoryByID,
  (_req, res) => {
    res.render('settings/editCategory') // render
  }
)
// update service assignment
categoryRouter.post(
  '/edit', // target
  sanitizeReqBody,
  updateCategory,
  (_req, res) => {
    res.redirect('/settings/categories') // redirect
  }
)
// add new service assignment
categoryRouter.post('/create', sanitizeReqBody, createCategory, (_req, res) => {
  res.redirect('/settings/categories')
})
// delete service assignment
categoryRouter.get('/delete/:id', deleteCategory, (_req, res) => {
  res.redirect('/settings/categories')
})
