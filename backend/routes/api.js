const router = require('express').Router()
const api = require('../controllers/api.js')
const auth = require('../middleware/auth.js')

router.get('/tool', auth.checkUserAuth, api.getUniqueTool)
router.get('/tools', api.getAllTools)
router.get('/tools/search',api.getToolsByMatch)
router.post('/tool', api.createTool)
router.put('/tool', api.updateTool)

// User Security Context User api routes
router.get('/user', api.getCurrentUser)
router.put('/user', api.updateUserByID)

// Manager Security Context User api routes
router.get('/users', api.getAllUsers)
router.get('/users/search', api.getUsersByRole)
router.post('/user', api.createUser)

module.exports = router