const router = require('express').Router()
const controller = require('../controllers/user.js')
const { getUsers } = require('../middleware/user.js')

// User Security Context
//router.get('/', controller.getCurrentUser)
//router.put('/', controller.updateSelfUser)

// Manager Security Context
router.get('/userManagement', getUsers, (_req, res) => { res.render('userManagement') })
router.get('/:id', controller.userProfileByID)

router.get('/search', controller.getUsersByRole)
router.post('/', controller.createUser)


module.exports = router