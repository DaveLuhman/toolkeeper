const router = require('express').Router()
const controller = require('../controllers/user.js')

// User Security Context
//router.get('/', controller.getCurrentUser)
//router.put('/', controller.updateSelfUser)

// Manager Security Context
router.get('/', controller.getAllUsers)
router.get('/userManagement', controller.userManagement)
//router.get('/:id', controller.getUserByID)

router.get('/search', controller.getUsersByRole)
router.post('/', controller.createUser)


module.exports = router