import { Router } from 'express'
import { importByFile } from '../../middleware/import/index.js'
import { listAllSAs } from '../../middleware/serviceAssignment.js'
import { getAllTools } from '../../middleware/tool.js'
import { renderSettingsImport } from '../../controllers/settings/import.js'
import {
  renderSettingsExport,
  exportCategories,
  exportServiceAssignments,
  exportTools,
} from '../../controllers/settings/export.js'
import { hoistOnboarding, importOnboardingComplete } from '../../middleware/onboarding.js'
export const importRouter = Router()

// load import index page
importRouter.get('/', hoistOnboarding, listAllSAs, getAllTools, renderSettingsImport)

// pre-import check and validation
importRouter.post('/submit', importByFile, renderSettingsImport )

// onboarding complete
importRouter.post('/onboarding-complete', importOnboardingComplete)

// export page
// @endpoint GET /settings/import/export
importRouter.get('/export', renderSettingsExport)

// export download endpoints
// @endpoint GET /settings/import/export/categories
importRouter.get('/export/categories', exportCategories)
// @endpoint GET /settings/import/export/serviceAssignments
importRouter.get('/export/serviceAssignments', exportServiceAssignments)
// @endpoint GET /settings/import/export/tools
importRouter.get('/export/tools', exportTools)

// src\routes\settings\import.routes.js
