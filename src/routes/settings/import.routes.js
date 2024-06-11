import { Router } from 'express'
import { importByFile } from '../../middleware/import/index.js'
import { listAllSAs } from '../../middleware/serviceAssignment.js'
import { getAllTools } from '../../middleware/tool.js'
import { renderSettingsImport } from '../../controllers/settings/import.js'
export const importRouter = Router()

// load import index page
importRouter.get('/', listAllSAs, getAllTools, renderSettingsImport)

// pre-import check and validation
importRouter.post('/submit', importByFile, renderSettingsImport )
