import { Router as expressRouter } from 'express';
import { createUser, getUsers, updateUser, resetPassword, disableUser } from '../middleware/user.js';

const router = expressRouter();

router.post('/resetPW/:id', isManager, resetPassword, (_req, res) => { res.render('userManagement', { layout: 'user.hbs' }) })
// verify user is manager and disable user
router.post('/disableUser/:id', isManager, disableUser, (_req, res) => { res.render('userManagement', { layout: 'user.hbs' }) })
// create new user
router.post('/createUser', isManager, createUser, (_req, res) => { res.render('userManagement', { layout: 'user.hbs' }) })
// verify user is manager and show user to edit
router.get('/:id', isManager, getUsers, (_req, res) => { res.render('editUser', { layout: 'user.hbs' }) })
// verify user is manager and update user
router.post('/:id', isManager, updateUser, (_req, res) => { res.redirect('./') })
// show user management page
router.get('/', isManager, getUsers, (_req, res) => { res.render('userManagement', { layout: 'user.hbs' }) })

export default router