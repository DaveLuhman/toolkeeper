import { Router as expressRouter } from 'express'
import { createUser, getUsers, updateUser, resetPassword, disableUser, getUserByID } from '../middleware/user.js'

export const managerRouter = expressRouter()

// show user management dashboard
managerRouter.get('/', getUsers, (_req, res) => {
  res.render('settings')
})
managerRouter.get('/user', getUsers, (_req, res) => {
  res.render('settings')
})
managerRouter.get('/serviceAssignment', getUsers, (_req, res) => {
  res.render('settings')
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
