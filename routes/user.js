const router = require('express').Router()
const controller = require('../controllers/user.js')
const { checkManager } = require('../middleware/auth.js')
const { getUsers, createUser, verifySelf, updateUser } = require('../middleware/user.js')



router.get('/userManagement/:id', getUsers, (_req, res) => { res.render('editUser') })
router.post('/userManagement/:id', checkManager, updateUser, (_req, res) => { res.render('userManagement') })
router.get('/userManagement', getUsers, (_req, res) => { res.render('userManagement') })
router.get('/:id', getUsers, (_req, res) => { res.render('profile') })
router.post('/:id', verifySelf, updateUser, getUsers, (_req, res) => { res.render('profile') })

router.get('/search', controller.getUsersByRole)
router.post('/', createUser, (_req, res) => { res.render('userManagement') })


module.exports = router