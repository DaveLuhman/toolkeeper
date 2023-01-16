const router = require('express').Router()
const controller = require('../controllers/tool.js')

router.get('/', controller.getAllTools)
router.get('/tools/search', controller.getMatchingTools)
router.post('/submit', controller.createTool)
router.post('/submitFile', controller.importFromCSV)
router.get('/:id', controller.getToolByID)
router.put('/:id', controller.updateToolbyID)


module.exports = router