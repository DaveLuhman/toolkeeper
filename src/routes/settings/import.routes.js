import { Router } from 'express'
import { importByFile } from '../../middleware/import/index.js'
import { listAllSAs } from '../../middleware/serviceAssignment.js'
import { getAllTools } from '../../middleware/tool.js'
export const importRouter = Router()

// load import index page
importRouter.get('/', listAllSAs, getAllTools, (_req, res) => {
  res.render('settings/import')
})

// pre-import check and validation
importRouter.post('/submit', importByFile, (_req, res) => {
  res.render('settings/import')
})
