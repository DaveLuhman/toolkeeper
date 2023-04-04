import { Router as expressRouter } from 'express'
import { createUser, getUsers, updateUser, resetPassword, disableUser, getUserByID } from '../middleware/user.js'
import { getServiceAssignments, getServiceAssignmentByID, updateServiceAssignment, createServiceAssignment, deleteServiceAssignment } from '../middleware/serviceAssignment.js'

export const managerRouter = expressRouter()

// show user management dashboard
managerRouter.get('/', getUsers, (_req, res) => {
  res.render('settings/users')
})
managerRouter.get('/users', getUsers, (_req, res) => {
  res.render('settings/users')
})
managerRouter.get('/serviceAssignments', getServiceAssignments, (_req, res) => {
  res.render('settings/serviceAssignments')
})
// get service assignment by ID and render edit page
managerRouter.get('/serviceAssignments/:id/edit', getServiceAssignmentByID, (_req, res) => {
  res.render('settings/serviceAssignmentEdit')
})
// update service assignment
managerRouter.post('/serviceAssignment/edit', updateServiceAssignment, (_req, res) => {
  res.redirect('/manager/serviceAssignments')
})
// add new service assignment
managerRouter.post('/serviceAssignments', createServiceAssignment, (_req, res) => {
  res.redirect('/manager/serviceAssignments')
})
// delete service assignment
managerRouter.get('/serviceAssignments/:id/delete', deleteServiceAssignment, (_req, res) => {
  res.redirect('/manager/serviceAssignments')
})
// get user by ID and render edit page
managerRouter.get('/user/:id', getUserByID, (_req, res) => {
  res.render('editUser')
})
// update user
managerRouter.post('/user/:id', updateUser, (_req, res) => {
  res.redirect('./')
})
// reset user's password
managerRouter.post('/user/resetPW/:id', resetPassword, (_req, res) => {
  res.render('settings')
})
// disable user
managerRouter.post('user/disableUser/:id', disableUser, (_req, res) => {
  res.render('settings')
})
// create new user
managerRouter.post('user/createUser', createUser, (_req, res) => {
  res.render('settings')
})
