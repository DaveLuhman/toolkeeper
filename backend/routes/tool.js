const router = require('express').Router
const controller = require('/backend/controllers/tool.controller')

router.get('/', controller.getAllTools)

module.exports = router