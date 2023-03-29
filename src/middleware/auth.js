import passport from 'passport'
import User from '../models/User.model.js'

/**
 * @param req Express Request object
 * @param  res  Express Response object
 * @param next  Express Next CB Function
 * @returns {void}
 * @description Checks if the user is authenticated
 * @example
 * app.get('/dashboard', checkAuth, (req, res) => {
 *  res.render('dashboard')
 * })
  **/
function checkAuth (req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user
    return next()
  }
  res.locals.message = 'You must be logged in to access that page'
  res.redirect('/login')
}
/**
 * @param req Express Request object
 * @param  res  Express Response object
 * @param next  Express Next CB Function
 * @returns {void}
 * @description Checks if the user is a manager
 * @example
 * app.get('/manager', checkAuth, isManager, (req, res) => {
 * res.render('manager')
 * })
 **/
function isManager (req, res, next) {
  if (req.user.role === 'User') {
    console.warn('[AUTH] User Is Not A Manager: ' + req.user.role)
    res.locals.error =
      'You are not a manager, and have been redirected to the dashboard'
    res.redirect('/dashboard')
    return
  }
  console.info('[AUTH] User Is A Manager: ' + req.user.role)
  return next()
}
/**
 * @param req Express Request object
 * @param  res  Express Response object
 * @param next  Express Next CB Function
 * @returns {void}
 * @description Logs the user in
 * @example
 * app.post('/login', login, (req, res) => {
 * res.redirect('/dashboard')
 * })
 * @todo fix the failure message
 **/
async function login (req, res, next) {
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next)
}

export function register (req, res, next) {
  const { firstName, lastName, email, password, confirmPassword } = req.body
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    res.locals.error = 'All fields are required'
    res.status(400).redirect('back')
  }
  if (password !== confirmPassword) {
    res.locals.error = 'Passwords must match'
    res.status(400).redirect('back')
  }
  const hash = bcrypt.hashSync(password, 10)
  try {
    User.create({
      firstName,
      lastName,
      email,
      password: hash
    })
  } catch (err) {
    res.locals.error = 'An error occurred when creating the user'
  }
}

/**
 * @param  req Express Request object
 * @param  res  Express Response object
 * @param next  Express Next CB Function
 * @returns {void}
 * @description Logs the user out
 * @example
 * app.get('/logout', logout, (req, res) => {
 * res.redirect('/')
 * })
 **/
function logout (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err)
    }
    res.redirect('/')
  })
}

export { checkAuth, isManager, login, logout }
