const router = require('express').Router()
const controller = require('/controllers/user.controller')

router.get('/', controller.getAllUsers)
router.get('/:id', controller.getUserById)


module.exports = router