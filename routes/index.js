const router = require('express').Router()
const passport = require('passport')


router.get('/' , (req , res)=>{ res.render('dashboard')}) // Render Dashboard
// get login page
router.get('/login' , (req , res) => {res.render('login', {layout: 'login.hbs', user: req.email, message: req.flash('error')})}) // Render Login Page
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), function(req, res) {
      res.redirect('/');
    });

router.get('/logout', function(req, res) {req.logout();res.redirect('/')});

module.exports  = router