const router = require('express').Router()

//@target /dashboard/
//@desc render dashboard
router.get('/' , (req , res)=>{
    res.render('dashboard')
})

//@target /dashboard/newTool
//@desc Open New Tool Modal
router.get('/userManagement' , (req , res)=>{
        res.render('userManagement')
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