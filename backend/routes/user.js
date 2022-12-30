const router = require('express').Router()
const controller = require('/backend/controllers/user.controller')

router.get('/', controller.getAllUsers)

module.exports = router