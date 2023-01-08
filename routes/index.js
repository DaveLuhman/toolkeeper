const router = require('express').Router()
const passport = require('passport')
const { checkUserAuth } = require('../middleware/auth')


router.get('/' , checkUserAuth, (_req , res) => { res.redirect('dashboard')}) // Render Public Landing Page
// get login page
router.get('/login' , (req , res) => {res.render('login', {layout: 'login.hbs', user: req.email, message: req.flash('error')})}) // Render Login Page
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), function(req, res) {
      res.redirect('dashboard');
    });

router.get('/logout', function(req, res) {req.logout();res.redirect('/')});

module.exports  = router