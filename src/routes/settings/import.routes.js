import { Router } from 'express'
import { importByFile } from '../../middleware/import/index.js'
import { listAllSAs } from '../../middleware/serviceAssignment.js'
import { getAllTools } from '../../middleware/tool.js'
import { renderSettingsImport } from '../../controllers/settings/import.js'
import { hoistOnboarding, importOnboardingComplete } from '../../middleware/onboarding.js'
export const importRouter = Router()

// load import index page
importRouter.get('/', hoistOnboarding, listAllSAs, getAllTools, renderSettingsImport)

// pre-import check and validation
importRouter.post('/submit', importByFile, renderSettingsImport )

// onboarding complete
importRouter.post('/onboarding-complete', importOnboardingComplete)

// src\routes\settings\import.routes.js
