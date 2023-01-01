const router = require('express').Router()


router.get('/' , (req , res)=>{ res.render('main.hbs')}) // Render Dashboard

//router.get('/badLogin', (_req, res) => {res.render('badLogin', {layout: 'login'})}) // Render Bad Login Page
// router.get('/logout', (req, res) => {req.logout(() => {}); res.redirect('/')}) // Logout User
// router.get('/signup', ensureAuth, (_req, res) => {res.render('signUp', {layout: 'login'})})     // Render Sign Up Page

// // @desc POST Routes
// router.post('/auth', passport.authenticate('local-signin', {successRedirect: '/dashboard', failureRedirect: '/badLogin'})) // Authenticate User
// router.post('/signup', passport.authenticate('local-signup', {successRedirect: '/dashboard', failureRedirect: '/signup'})) // Create User



module.exports = router;

