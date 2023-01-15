const router = require('express').Router()
const indexController = require('../controllers/index')
const dashboardController = require('../controllers/dashboard')

router.get('/', indexController.getIndex ) // Render Public Landing Page

router.get('/login', indexController.getLoginPage) // Render Login Page

router.post('/login', indexController.postLoginPage, dashboardController.getIndexDashboard ) // Login User

router.get('/logout', indexController.logUserOut) // Logout User);

module.exports = router