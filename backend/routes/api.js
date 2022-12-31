const router = require('express').Router
const api = require('../controllers/api.js')
const { checkAuthUser, checkAuthManager } = require('../middleware/auth.js')

router.get('/tool', checkAuthUser, api.getUniqueTool)
// router.get('/tools', checkAuthUser, api.getAllTools())
// router.get('/tools/search',checkAuthUser, api.getToolsByMatch())
// router.post('/tool', checkAuthUser, api.createTool())
// router.put('/tool', checkAuthUser, api.updateTool())

// // User Security Context User api routes
// router.get('/user', checkAuthUser, api.getCurrentUser())
// router.put('/user', checkAuthUser, api.updateUserByID())

// // Manager Security Context User api routes
// router.get('/users', checkAuthManager, api.getAllUsers())
// router.get('/users/search', checkAuthManager, api.getUsersByMatch())
// router.post('/user', checkAuthManager, api.createUser())

module.exports = router