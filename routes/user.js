const router = require('express').Router()
const controller = require('../controllers/user.js')
const { checkManagerAuth } = require('../middleware/auth');


// router.get('/', controller.getAllUsers)
// router.get('/:id', controller.getUserById)
router.post('/', checkManagerAuth, controller.createUser)
// router.put('/:id', checkManagerAuth, controller.updateUser)



module.exports = router