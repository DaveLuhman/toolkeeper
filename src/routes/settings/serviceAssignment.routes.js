import { Router } from 'express'
import {
  getServiceAssignments,
  getServiceAssignmentByID,
  updateServiceAssignment,
  createServiceAssignment,
  deleteServiceAssignment
} from '../../middleware/serviceAssignment.js'

const serviceAssignmentRouter = Router()

serviceAssignmentRouter.get('/', getServiceAssignments, (_req, res) => {
  res.render('settings/serviceAssignments')
})
// get service assignment by ID and render edit page
serviceAssignmentRouter.get(
  '/serviceAssignments/edit/:id', // target
  getServiceAssignmentByID,
  (_req, res) => {
    res.render('settings/serviceAssignmentEdit') // render
  }
)
// update service assignment
serviceAssignmentRouter.post(
  '/serviceAssignment/edit', // target
  updateServiceAssignment,
  (_req, res) => {
    res.redirect('/settings/serviceAssignments') // redirect
  }
)
// add new service assignment
serviceAssignmentRouter.post(
  '/serviceAssignment/create',
  createServiceAssignment,
  (_req, res) => {
    res.redirect('/settings/serviceAssignments')
  }
)
// delete service assignment
serviceAssignmentRouter.get(
  '/serviceAssignments/:id/delete',
  deleteServiceAssignment,
  (_req, res) => {
    res.redirect('/settings/serviceAssignments')
  }
)
