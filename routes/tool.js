const router = require('express').Router()
const { getTools, createTool, updateTool } = require('../middleware/tool.js')

router.get('/:id', getTools, (_req, res) => {res.render('editTool');})
router.post('/submit', createTool, (_req, res) => {res.render('dashboard');})
router.post('/update/:id', updateTool, (_req, res) => {res.render('dashboard');})


module.exports = router