const router = require('express').Router()
const authController = require('../controllers/auth.js')
const passport = require('passport')


router.get('/' , (req , res)=>{ res.render('dashboard')}) // Render Dashboard
// get login page
router.get('/login' , (req , res) => {res.render('login', {layout: 'login.hbs'})}) // Render Login Page
router.post('/login' , authController.validateLogin) // Validate Login
router.get('/logout', (req, res) => {req.logout(() => {}); res.redirect('/')}) // Logout User

module.exports  = router