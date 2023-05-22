import { Router } from 'express'
import { testImportFunction } from '../../middleware/import/index.js'
export const importRouter = Router()

// load import index page
importRouter.get('/', (_req, res) => {
  res.render('settings/import')
})

// pre-import check and validation
importRouter.post('/submit', testImportFunction, (_req, res) => {
  res.render('settings/import')
})
