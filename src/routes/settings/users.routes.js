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
import { renderSettingsEditUser, renderSettingsUsers } from '../../controllers/settings/user.js'
import { hoistOnboarding } from '../../middleware/onboarding.js'
export const userSettingsRouter = Router()

// @desc get all users and render settings page
// @endpoint GET /settings/users
userSettingsRouter.get('/', hoistOnboarding, getUsers, renderSettingsUsers)

// @desc reset another user's password
// @endpoint POST /settings/users/resetPW/:id
userSettingsRouter.post('/resetPW/:id', resetPassword, renderSettingsUsers)

// @desc disable user
// @endpoint POST /settings/users/disableUser/:id
userSettingsRouter.post('/disableUser/:id', disableUser, renderSettingsUsers)

// @desc create new user
// @endpoint POST /settings/users/create
userSettingsRouter.post('/create', sanitizeReqBody, createUser, getUsers, renderSettingsUsers)

// @desc get user by ID and render edit page
// @endpoint GET /settings/users/:id
userSettingsRouter.get('/:id', getUserByID, renderSettingsEditUser)

// @desc update user and redirect to settings page
// @endpoint POST /settings/users/:id
userSettingsRouter.post('/:id', sanitizeReqBody, updateUser, getUsers, renderSettingsUsers)

// src\routes\settings\users.routes.js
