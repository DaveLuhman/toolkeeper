import { Router } from 'express'
import {
  createUser,
  getUsers,
  updateUser,
  resetPassword,
  disableUser,
  getUserByID
} from '../../middleware/user.js'

export const userSettingsRouter = Router()

userSettingsRouter.get('/', getUsers, (_req, res) => {
  res.render('settings/users')
})
// get user by ID and render edit page
userSettingsRouter.get('/:id', getUserByID, (_req, res) => {
  res.render('editUser')
})
// update user
userSettingsRouter.post('/:id', updateUser, (_req, res) => {
  res.redirect('./')
})
// reset user's password
userSettingsRouter.post('/resetPW/:id', resetPassword, (_req, res) => {
  res.render('settings')
})
// disable user
userSettingsRouter.post('/disableUser/:id', disableUser, (_req, res) => {
  res.render('settings')
})
// create new user
userSettingsRouter.post('/createUser', createUser, (_req, res) => {
  res.render('settings')
})
