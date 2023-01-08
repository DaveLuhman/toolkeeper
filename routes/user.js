const router = require('express').Router()
const controller = require('../controllers/user.js')
const { checkManagerAuth } = require('../middleware/auth');

// User Security Context
//router.get('/', controller.getCurrentUser)
//router.put('/', controller.updateSelfUser)

// Manager Security Context
router.get('/:id', checkManagerAuth, controller.getUserByID)
router.get('/',  checkManagerAuth, controller.getAllUsers)
router.get('/search',  checkManagerAuth, controller.getUsersByRole)
router.post('/',  checkManagerAuth,  controller.createUser)

module.exports = router