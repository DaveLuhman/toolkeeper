import { Router } from 'express'
import { login, logout, register } from '../middleware/auth.js'
import { toolController } from '../controllers/tool.js'

export const indexRouter = Router()

// Render Public Landing Page
indexRouter.get('/', (_req, res) => {
  res.render('index', { layout: 'public.hbs' })
})

// Render Login Page
indexRouter.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/dashboard')
  } else {
    res.render('login', { layout: 'auth.hbs' })
  }
})



// Login User
indexRouter.post('/login', login, (_req, res) => {
  res.redirect('/dashboard')
})

// Render register Page
indexRouter.get('/register', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/dashboard')
  } else {
    res.render('register', { layout: 'auth.hbs' })
  }
})
// Register User
indexRouter.post('/register', register, (_req, res) => {
  res.redirect('/dashboard')
})

// Logout User
indexRouter.get('/logout', logout)

// Import Tool Data from CSV
indexRouter.post('/submitFile', toolController.importFromCSV)
