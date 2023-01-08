const router = require('express').Router()
const controller = require('../controllers/tool.js')

router.get('/', controller.getAllTools)
router.get('/tools/search', controller.getMatchingTools)
router.post('/tool', controller.createTool)
router.put('/tool', controller.updateTool)


module.exports = router