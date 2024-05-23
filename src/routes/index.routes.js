import { Router } from 'express'
import { login, logout } from '../middleware/auth.js'
import { createUser } from '../middleware/user.js'
import {
  redirectToDashboard,
  renderLandingPage,
  renderLoginPage,
  renderRegisterPage,
} from '../controllers/index.js'

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
indexRouter.post('/register', createUser, renderLoginPage)
// Logout User
indexRouter.get('/logout', logout)
