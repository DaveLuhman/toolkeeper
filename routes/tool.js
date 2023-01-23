import { Router } from 'express';
import { checkTools, archiveTool, createTool, getTools, updateTool } from '../middleware/tool.js';
const router = Router();

router.get('/:id', getTools, (_req, res) => {
    if (res.locals.tools[0]) return res.render('editTool'); // if tool exists render editTool
    else return res.redirect('../dashboard'); //if bad id redirect to dashboard
})
router.post('/checkTools', checkTools, (_req, res) => { res.render('editTool'); })
router.post('/submit', createTool, (_req, res) => { res.render('dashboard'); })
router.post('/update/', updateTool, (_req, res) => { res.render('dashboard'); })

router.get('/archive/:id', archiveTool, getTools, (_req, res) => { res.render('dashboard'); })
d

export default router