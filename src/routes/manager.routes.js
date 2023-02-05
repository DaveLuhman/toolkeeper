import { Router as expressRouter } from 'express'
import { createUser, getUsers, updateUser, resetPassword, disableUser, getUserByID } from '../middleware/user.js'

export const managerRouter = expressRouter()

// show user management dashboard
managerRouter.get('/', getUsers, (_req, res) => {
  res.render('userManagement', { layout: 'user.hbs' })
})

// get user by ID and render edit page
managerRouter.get('/:id', getUserByID, (_req, res) => {
  res.render('editUser', { layout: 'user.hbs' })
})

// update user
managerRouter.post('/:id', updateUser, (_req, res) => {
  res.redirect('./')
})

// reset user's password
managerRouter.post('/resetPW/:id', resetPassword, (_req, res) => {
  res.render('userManagement', { layout: 'user.hbs' })
})

// disable user
managerRouter.post('/disableUser/:id', disableUser, (_req, res) => {
  res.render('userManagement', { layout: 'user.hbs' })
})

// create new user
managerRouter.post('/createUser', createUser, (_req, res) => {
  res.render('userManagement', { layout: 'user.hbs' })
})
