const Tool = require('../models/tool')
const User = require('../models/user')
const toolController = require('../controllers/tool')
const router = require('express').Router()

//@target /dashboard/
//@desc render dashboard
router.get('/' , async (req , res)=>{
    req.session.user = req.session.passport.user;
    const tools = await Tool.find({});
    //console.log(tools)
    res.render('dashboard', {tools: tools, user: req.session.user})
})


//@target /dashboard/newTool
//@desc Open New Tool Modal
router.get('/userManagement' , async (req , res)=>{
        const users = await User.find({});
        console.log(users)
        res.render('userManagement', {users:users})
})

//@target /dashboard/newTool
//@desc Open Checkout Modal
router.get('/checkOut' , (req , res)=>{
    // router code here
})

//@target /dashboard/newTool
//@desc Open CheckIn Modal
router.get('/checkIn' , (req , res)=>{
    // router code here
})

module.exports  = router