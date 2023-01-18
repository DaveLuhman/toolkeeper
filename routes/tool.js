const router = require('express').Router()
const toolController = require('../controllers/tool.js')
const dashboardController = require('../controllers/dashboard.js')

router.get('/', toolController.getAllTools)
router.post('/search', dashboardController.renderDashboard)
router.post('/submit', toolController.createTool)
router.get('/:id', toolController.getToolByID)
router.put('/:id', toolController.updateToolbyID)


module.exports = router