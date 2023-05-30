import { Router } from 'express'
import {
  getServiceAssignments,
  getServiceAssignmentByID,
  updateServiceAssignment,
  createServiceAssignment,
  deleteServiceAssignment
} from '../../middleware/serviceAssignment.js'
import { sanitizeReqBody } from '../../middleware/util.js'

export const serviceAssignmentRouter = Router()

// @desc get all service assignments and render settings page
// @endpoint GET /settings/serviceAssignments
serviceAssignmentRouter.get('/', getServiceAssignments, (_req, res) => {
  res.render('settings/serviceAssignments')
})
// @desc get service assignment by ID and render edit page
// @endpoint GET /settings/serviceAssignments/edit/:id
serviceAssignmentRouter.get(
  '/edit/:id', // target
  getServiceAssignmentByID,
  (_req, res) => {
    res.render('settings/editServiceAssignment') // render
  }
)
// @desc update service assignment and redirect to settings page
// @endpoint POST /settings/serviceAssignments/edit
serviceAssignmentRouter.post(
  '/edit', // target
  sanitizeReqBody,
  updateServiceAssignment,
  (_req, res) => {
    res.redirect('/settings/serviceAssignments') // redirect
  }
)
// @desc add new service assignment and redirect to settings page
// @endpoint POST /settings/serviceAssignments/create
serviceAssignmentRouter.post(
  '/create',
  sanitizeReqBody,
  createServiceAssignment,
  (_req, res) => {
    res.redirect('/settings/serviceAssignments')
  }
)
// @desc delete service assignment and redirect to settings page
// @endpoint GET /settings/serviceAssignments/delete/:id
serviceAssignmentRouter.get(
  '/delete/:id/',
  deleteServiceAssignment,
  (_req, res) => {
    res.redirect('/settings/serviceAssignments')
  }
)
