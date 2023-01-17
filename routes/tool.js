const router = require('express').Router()
const controller = require('../controllers/tool.js')

router.get('/', controller.getAllTools)
router.post('/searchSN', controller.getToolBySN)
router.post('/searchPN', controller.getToolByPN)
router.post('/searchBC', controller.getToolByBC)
router.post('/searchSA', controller.getToolBySA)
router.post('/submit', controller.createTool)
router.post('/submitFile', controller.importFromCSV)
router.get('/:id', controller.getToolByID)
router.put('/:id', controller.updateToolbyID)


module.exports = router