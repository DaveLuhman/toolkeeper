import { getAllTools } from '../middleware/tool.js';
import { Router } from 'express';

const router = Router();

//@target /dashboard
//@method POST
//@desc search for tools if needed via middleware then render dashboard
router.use('/', getAllTools, (_req, res) => { res.render('dashboard'); });


export default router;