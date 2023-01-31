import { Router as expressRouter } from 'express';
import { updateUser, resetPassword } from '../middleware/user.js';

const router = expressRouter();
// show user their own profile
router.get('/profile', (_req, res) => { res.render('profile', { layout: 'user.hbs' }) })
// update user's own profile
router.post('/profile', updateUser, (_req, res) => { res.render('profile', { layout: 'user.hbs' }) })
// update user's own password
router.post('/resetPassword', resetPassword, (_req, res) => { res.render('profile', { layout: 'user.hbs' }) })


export default router