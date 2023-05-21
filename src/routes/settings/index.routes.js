import { Router as expressRouter } from 'express'
import { getUsers } from '../../middleware/user.js'
import { userSettingsRouter } from './userSettings.routes.js'
import { serviceAssignmentRouter } from './serviceAssignment.routes.js'
import { categoryRouter } from './category.routes.js'
import { materialRouter } from './material.routes.js'
import { importRouter } from './import.routes.js'

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

// all category routes go to categoryRouter
// @route  * /settings/categories
settingsRouter.use('/categories', categoryRouter)

// all material routes go to categoryRouter
// @route  * /settings/categories
settingsRouter.use('/materials', materialRouter)

// all import routes go to importRouter
// @route * /settings/import
settingsRouter.use('/import', importRouter)
