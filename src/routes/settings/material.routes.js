import { Router } from 'express'
import {
  getMaterials,
  getMaterialByID,
  updateMaterial,
  createMaterial,
  deleteMaterial,
} from '../../middleware/material.js'
import { sanitizeReqBody } from '../../middleware/util.js'
import {
  renderSettingsEditMaterial,
  renderSettingsMaterials,
} from '../../controllers/settings/material.js'

export const materialRouter = Router()

materialRouter.get('/', getMaterials, renderSettingsMaterials)
// get tool material by ID and render edit page
materialRouter.get(
  '/edit/:id', // target
  getMaterialByID,
  renderSettingsEditMaterial
)
// update tool material
materialRouter.post(
  '/edit', // target
  sanitizeReqBody,
  updateMaterial,
  renderSettingsMaterials
)
// add new tool material
materialRouter.post(
  '/create',
  sanitizeReqBody,
  createMaterial,
  getMaterials,
  renderSettingsMaterials
)
// delete tool material
materialRouter.get(
  '/delete/:id',
  deleteMaterial,
  getMaterials,
  renderSettingsMaterials
)
