module.exports = {
    checkUserAuth: function (req, res, next) {
        if (req.isAuthenticated()) {
            console.log('ensureAuth middleware pass')
            return next()}
        else {
            console.log('ensureAuth middleware fail')
            res.redirect('/')}
    },
    checkManagerAuth: function (req, res, next) {
        if (req.isAuthenticated() && req.user.role === 'manager') {
            console.log('ensureManager middleware pass')
            return next()}
        else {
            console.log('ensureManager middleware fail')
            res.send('Unauthorized')
        }
    },
    ensureGuest: function (req, res, next) {
        console.log('ensureGuest')
        if (req.isAuthenticated()) res.redirect('/logout')
        return next()
    },
    logoutSession: function (req, res, next) {
        console.log('logoutSession')
        req.logout(() => {res.redirect('/')})
    }
}