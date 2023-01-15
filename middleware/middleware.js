middleware = {}
middleware.logRequest = function(req, res, next) {
   // console.log(`Request Authenticated: ${req.isAuthenticated()}`)
    if(req.isAuthenticated()) {
        user = req.user }
    next()
}
middleware.checkAuth = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}


module.exports = middleware