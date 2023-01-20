const router = require('express').Router()
const { getTools, createTool, updateTool, archiveTool } = require('../middleware/tool.js')

router.get('/:id', getTools, (_req, res) => {
    if (res.locals.tools[0]) return res.render('editTool');
    else return res.redirect('../dashboard');
})
router.post('/submit', createTool, (_req, res) => { res.render('dashboard'); })
router.post('/update/:id', updateTool, (_req, res) => { res.render('dashboard'); })
router.post('/archive/:id', archiveTool, getTools, (_req, res) => { res.render('dashboard'); })


module.exports = router