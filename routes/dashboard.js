const { getTools } = require('../middleware/tool')
const router = require('express').Router()


//@target /dashboard
//@method POST
//@desc search for tools if needed via middleware then render dashboard
router.use('/', getTools, (_req, res) => { res.render('dashboard'); });


module.exports = router