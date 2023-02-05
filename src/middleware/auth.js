import passport from 'passport'

function checkAuth (req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user
    return next()
  }
  res.locals.message = 'You must be logged in to access that page'
  res.redirect('/login')
}
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
async function login (req, res, next) {
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next)
}

function logout (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err)
    }
    res.redirect('/')
  })
}

export { checkAuth, isManager, login, logout }
