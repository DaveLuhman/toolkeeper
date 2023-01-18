const Tool = require('../models/tool')
const User = require('../models/user')
const toolController = require('../controllers/tool')
const dashboardController = require('../controllers/dashboard')
const { checkAuth, getTools } = require('../middleware/middleware')
const router = require('express').Router()

//@target /dashboard/
//@method GET
//@desc render dashboard
router.get('/', dashboardController.renderDashboard)

//@target /dashboard
//@method POST
//@desc search for tools then render dashboard
router.post('/', dashboardController.renderSearch)


//@target /dashboard/newTool
//@desc Open New Tool Modal
router.get('/userManagement' , async (req , res)=>{
        const users = await User.find({});
        console.log(users)
        res.render('userManagement', {users:users})
})

//@target /dashboard/newTool
//@desc Open Checkout Modal
router.get('/checkInOut' , (req , res) => {
    res.render('checkInOut', {user: req.user})
})

//@target /dashboard/newTool
//@desc Open CheckIn Modal
router.get('/checkIn' , (req , res)=>{
    // router code here
})

module.exports  = router