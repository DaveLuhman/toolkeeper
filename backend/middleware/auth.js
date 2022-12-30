module.exports = {
    ensureAuth: function (req, res, next) {
        if (req.isAuthenticated()) {
            console.log('ensureAuth middleware pass')
            return next()}
        else {
            console.log('ensureAuth middleware fail')
            res.redirect('/')}
    },
    ensureGuest: function (req, res, next) {
        console.log('ensureGuest')
        if (req.isAuthenticated())
            res.redirect('/logout')
        return next()
    },
    logoutSession: function (req, res, next) {
        console.log('logoutSession')
        req.logout(() => {res.redirect('/')})
    }
}