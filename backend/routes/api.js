const router = require('express').Router
const API = require('/backend/controllers/api.js')
const { checkAuthUser, checkAuthManager } = require('/backend/middleware/auth.js')

// User Security Context Tool API routes
router.get('/tool', checkAuthUser, API.getUniqueTool())
router.get('/tools', checkAuthUser, API.getAllTools())
router.get('/tools/search',checkAuthUser, API.getToolsByMatch())
router.post('/tool', checkAuthUser, API.createTool())
router.put('/tool', checkAuthUser, API.updateTool())

// User Security Context User API routes
router.get('/user', checkAuthUser, API.getCurrentUser())
router.put('/user', checkAuthUser, API.updateUserByID())

// Manager Security Context User API routes
router.get('/users', checkAuthManager, API.getAllUsers())
router.get('/users/search', checkAuthManager, API.getUsersByMatch())
router.post('/user', checkAuthManager, API.createUser())

module.exports = router