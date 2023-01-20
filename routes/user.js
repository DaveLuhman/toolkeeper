const router = require('express').Router()
const { isManager } = require('../middleware/auth.js')
const { getUsers, createUser, verifySelf, updateUser } = require('../middleware/user.js')

router.get('/profile', verifySelf, (_req, res) => { res.render('profile') })  // show user their own profile
router.get('/:id', verifySelf, getUsers, (_req, res) => { res.render('profile') })  //show user their own profile
router.post('/:id', verifySelf, updateUser, getUsers, (_req, res) => { res.render('profile') }) // update user's own profile


router.get('/userManagement/:id', isManager, getUsers, (_req, res) => { res.render('editUser') }) // verify user is manager and show user to edit
router.post('/userManagement/:id', isManager, updateUser, (_req, res) => { res.render('userManagement') })
router.get('/', isManager, getUsers, (_req, res) => { res.render('userManagement') })
router.post('/', isManager, createUser, (_req, res) => { res.render('userManagement') })

module.exports = router