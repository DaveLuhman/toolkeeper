const router = require('express').Router()
const passport = require('passport')
const User = require('../models/user')


router.get('/', (_req, res) => { res.render('root') }) // Render Public Landing Page
// get login page
router.get('/login', (req, res) => { res.render('login', { layout: 'login.hbs', user: req.email, message: req.flash('error') }) }) // Render Login Page
router.post(
  '/login',
  passport.authenticate('local',{ successRedirect: '/dashboard', failureRedirect: '/login', failureFlash: true }),
  (req, res) => { res.redirect('/dashboard') }) // Login User

router.get('/logout', function (req, res) { req.logout(); res.redirect('/') });

module.exports = router