import { Router } from 'express'
import {
  createUser,
  getUsers,
  updateUser,
  resetPassword,
  disableUser,
  getUserByID
} from '../../middleware/user.js'
import { sanitizeReqBody } from '../../middleware/util.js'

export const userSettingsRouter = Router()

// @desc get all users and render settings page
// @endpoint GET /settings/users
userSettingsRouter.get('/', getUsers, (_req, res) => {
  res.render('settings/users')
})
// @desc get user by ID and render edit page
// @endpoint GET /settings/users/:id
userSettingsRouter.get('/:id', getUserByID, (_req, res) => {
  res.render('settings/editUser')
})
// @desc update user and redirect to settings page
// @endpoint POST /settings/users/:id
userSettingsRouter.post('/:id', sanitizeReqBody, updateUser, (_req, res) => {
  res.redirect('./')
})
// @desc reset another user's password
// @endpoint POST /settings/users/resetPW/:id
userSettingsRouter.post('/resetPW/:id', resetPassword, (_req, res) => {
  res.render('settings')
})
// @desc disable user
// @endpoint POST /settings/users/disableUser/:id
userSettingsRouter.post('/disableUser/:id', disableUser, (_req, res) => {
  res.render('settings')
})
// @desc create new user
// @endpoint POST /settings/users/createUser
userSettingsRouter.post(
  '/createUser',
  sanitizeReqBody,
  createUser,
  (_req, res) => {
    res.render('settings')
  }
)
