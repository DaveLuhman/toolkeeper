import { Router as expressRouter } from 'express'
import { getUsers } from '../../middleware/user.js'
import { userSettingsRouter } from './userSettings.routes.js'
import { serviceAssignmentRouter } from './serviceAssignment.routes.js'

export const settingsRouter = expressRouter()

// show settings index page
// @route  GET /settings
settingsRouter.get('/', getUsers, (_req, res) => {
  res.render('settings/users')
})
// all userSettings routes go to userSettingsRouter
// @route  * /settings/users
settingsRouter.use('/users', userSettingsRouter)

// all serviceAssignment routes go to serviceAssignmentRouter
// @route  * /settings/serviceAssignments
settingsRouter.use('/serviceAssignments', serviceAssignmentRouter)
