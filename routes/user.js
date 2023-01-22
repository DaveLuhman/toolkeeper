import { Router as expressRouter } from 'express';
import { isManager } from '../middleware/auth.js';
import { createUser, getUsers, updateUser, verifySelf, resetPassword, disableUser } from '../middleware/user.js';

const router = expressRouter();
 // show user their own profile
router.get('/profile', verifySelf, (_req, res) => { res.render('profile', {layout: 'user.hbs'}) })
// update user's own profile
router.post('/profile', verifySelf, updateUser, (_req, res) => { res.render('profile', {layout: 'user.hbs'}) })
// update user's own password
router.post('/resetPassword', verifySelf, resetPassword, (_req, res) => { res.render('profile', {layout: 'user.hbs'}) })

// START MANAGER ROUTES
// verify user is manager and disable user
router.post('/userManagement/disableUser/:id', isManager, disableUser, (_req, res) => { res.render('userManagement', {layout: 'user.hbs'}) })
// verify user is manager and reset user password
router.post('/userManagement/resetPW/:id', isManager, resetPassword, (_req, res) => { res.render('userManagement', {layout: 'user.hbs'}) })
// verify user is manager and update user
router.post('/userManagement/:id', isManager, updateUser, (_req, res) => { res.render('userManagement', {layout: 'user.hbs'}) })
// verify user is manager and show user to edit
router.get('/userManagement/:id', isManager, getUsers, (_req, res) => { res.render('editUser', {layout: 'user.hbs'}) })
// create new user
router.post('/userManagement/createUser', isManager, createUser, (_req, res) => { res.render('userManagement', {layout: 'user.hbs'}) })
// show user management page
router.get('/userManagement', isManager, getUsers, (_req, res) => { res.render('userManagement', {layout: 'user.hbs'}) })

export default router