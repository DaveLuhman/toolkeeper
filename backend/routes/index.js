const router = require('express').Router()


router.get('/' , (req , res)=>{
    let test = req.body.name
    res.send('hello world')
    // router code here
})


router.get('/another-route' , (req , res)=>{
    // router code here
})

module.exports  = router