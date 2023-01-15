const router = require('express').Router()
const controller = require('../controllers/tool.js')

router.get('/', controller.getAllTools)
router.get('/tools/search', controller.getMatchingTools)
router.post('/submit', controller.createTool)
router.post('/submitFile', controller.importFromCSV)
router.get('/tool:id', controller.getToolByID)
router.put('/tool:id', controller.updateToolbyID)


module.exports = router