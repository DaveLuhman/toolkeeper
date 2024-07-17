import { Router } from 'express'
import { postPropelAuth, requireUser } from '../middleware/auth.js'
import { createUser } from '../middleware/user.js'
import {
  renderLandingPage,
  renderLoginPage,
  renderRegisterPage,
} from '../controllers/index.js'
import { executeResetPasswordRequest, submitResetPasswordRequest, verifyResetPasswordRequest } from '../controllers/user.js'

export const indexRouter = Router()

// Render Public Landing Page
indexRouter.get('/', renderLandingPage)
// Capture post-auth response from PropelAuth
indexRouter.get('/propelauth', requireUser, postPropelAuth)
indexRouter.post('/forgotPassword', submitResetPasswordRequest)
// Render Reset Password Page
indexRouter.get('/forgotPassword/:token', verifyResetPasswordRequest)
// Execute Reset Password
indexRouter.post('/forgotPassword/:token', executeResetPasswordRequest)