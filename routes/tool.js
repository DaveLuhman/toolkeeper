const router = require('express').Router()
const controller = require('../controllers/tool.js')

router.get('/', controller.getAllTools)
router.get('/tools/search', controller.getMatchingTools)
router.post('/tool', controller.createTool)
router.get('/tool:id', controller.getToolByID)
router.put('/tool:id', controller.updateToolbyID)


module.exports = router