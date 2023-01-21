import { Router as expressRouter } from 'express';
import { isManager } from '../middleware/auth.js';
import { createUser, getUsers, updateUser, verifySelf } from '../middleware/user.js';

const router = expressRouter();

router.get('/profile', verifySelf, (_req, res) => { res.render('profile') })  // show user their own profile
router.get('/:id', verifySelf, getUsers, (_req, res) => { res.render('profile') })  //show user their own profile
router.post('/:id', verifySelf, updateUser, getUsers, (_req, res) => { res.render('profile') }) // update user's own profile


router.get('/userManagement/:id', isManager, getUsers, (_req, res) => { res.render('editUser') }) // verify user is manager and show user to edit
router.post('/userManagement/:id', isManager, updateUser, (_req, res) => { res.render('userManagement') })
router.get('/userManagement', isManager, getUsers, (_req, res) => { res.render('userManagement') })
router.post('/userManagement/createUser', isManager, createUser, (_req, res) => { res.render('userManagement') })

export default router