middleware = {}

middleware.checkAuth = function(req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user
        return next()
    }
    res.redirect('/login')
}

middleware.hoistGlobals = function(req, res, next) {

    next()
}


module.exports = middleware