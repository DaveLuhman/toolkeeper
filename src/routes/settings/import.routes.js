import { Router } from 'express'
import { importServiceAssignments } from '../../middleware/import/sqlite'
export const importRouter = Router()

// load import index page
importRouter.get('/', (_req, res) => {
  res.render('settings/import')
})

// start serviceAssignment import
importRouter.post(
  '/serviceAssignments',
  importServiceAssignments,
  (_req, res) => {
    res.render('settings/importServiceAssignment')
  }
)
