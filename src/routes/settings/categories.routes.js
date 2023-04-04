import { Router } from 'express'
import {
  getcategories,
  getcategoriesByID,
  updatecategories,
  createcategories,
  deletecategories
} from '../../middleware/categories.js'

const categoriesRouter = Router()

categoriesRouter.get('/', getcategories, (_req, res) => {
  res.render('settings/categories')
})
// get service assignment by ID and render edit page
categoriesRouter.get(
  '/categories/edit/:id', // target
  getcategoriesByID,
  (_req, res) => {
    res.render('settings/categoriesEdit') // render
  }
)
// update service assignment
categoriesRouter.post(
  '/categories/edit', // target
  updatecategories,
  (_req, res) => {
    res.redirect('/settings/categories') // redirect
  }
)
// add new service assignment
categoriesRouter.post('/categories/create', createcategories, (_req, res) => {
  res.redirect('/settings/categories')
})
// delete service assignment
categoriesRouter.get(
  '/categories/:id/delete',
  deletecategories,
  (_req, res) => {
    res.redirect('/settings/categories')
  }
)
