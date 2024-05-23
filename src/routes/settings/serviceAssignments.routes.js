import { Router } from 'express'
import {
  getServiceAssignments,
  getServiceAssignmentByID,
  updateServiceAssignment,
  createServiceAssignment,
  deleteServiceAssignment,
  deactivateServiceAssignment,
  activateServiceAssignment,
} from '../../middleware/serviceAssignment.js'
import { sanitizeReqBody } from '../../middleware/util.js'
import {
  renderSettingsEditServiceAssignment,
  renderSettingsServiceAssignments,
} from '../../controllers/settings/serviceAssignment.js'

export const serviceAssignmentRouter = Router()

// @desc get all service assignments and render settings page
// @endpoint GET /settings/serviceAssignments
serviceAssignmentRouter.get(
  '/',
  getServiceAssignments,
  renderSettingsServiceAssignments
)
// @desc get service assignment by ID and render edit page
// @endpoint GET /settings/serviceAssignments/edit/:id
serviceAssignmentRouter.get(
  '/edit/:id', // target
  getServiceAssignmentByID,
  renderSettingsEditServiceAssignment
)
// @desc update service assignment and redirect to settings page
// @endpoint POST /settings/serviceAssignments/edit
serviceAssignmentRouter.post(
  '/edit', // target
  sanitizeReqBody,
  updateServiceAssignment,
  getServiceAssignments,
  renderSettingsServiceAssignments
)
// @desc add new service assignment and redirect to settings page
// @endpoint POST /settings/serviceAssignments/create
serviceAssignmentRouter.post(
  '/create',
  sanitizeReqBody,
  createServiceAssignment,
 getServiceAssignments,
 renderSettingsServiceAssignments
)
// @desc deactivate service assignment and redirect to service assignements page
// @endpoint GET /settings/serviceAssignments/deactivate/:id
serviceAssignmentRouter.get(
  '/deactivate/:id/',
  deactivateServiceAssignment,
  getServiceAssignments,
  renderSettingsServiceAssignments
)
// @desc activate service assignment and redirect to service assignements page
// @endpoint GET /settings/serviceAssignments/activate/:id
serviceAssignmentRouter.get(
  '/activate/:id/',
  activateServiceAssignment,
  getServiceAssignments,
  renderSettingsServiceAssignments
)
