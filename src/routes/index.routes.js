import { Router } from 'express'
import { login, logout } from '../middleware/auth.js'
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
// Render Login Page
indexRouter.get('/login', renderLoginPage)
// Login User
indexRouter.post('/login', login)
// Render register Page
indexRouter.get('/register', renderRegisterPage)
// Register User
indexRouter.post('/register', createPendingUser)
// Logout User
indexRouter.get('/logout', logout)
// Submit Forgot Password Modal
indexRouter.post('/forgotPassword', submitResetPasswordRequest)
// Render Reset Password Page
indexRouter.get('/forgotPassword/:token', verifyResetPasswordRequest)
// Execute Reset Password
indexRouter.post('/forgotPassword/:token', executeResetPasswordRequest)