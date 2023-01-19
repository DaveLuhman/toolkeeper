const router = require('express').Router()
const { getTools, createTool, updateTool } = require('../middleware/tool.js')

router.get('/:id', getTools, (_req, res) => {
    if(res.locals.tools.length != []) { return res.render('editTool'); }
    else console.log('not found, redirecting to dashboard'.red)
    return res.redirect('../dashboard');})
router.post('/submit', createTool, (_req, res) => {res.render('dashboard');})
router.post('/update/:id', updateTool, (_req, res) => {res.render('dashboard');})


module.exports = router