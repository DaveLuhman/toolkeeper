const Session = require('../models/session')
const User = require('../models/user')
module.exports = {
    checkUserAuth: function (req, res, next) {
        if (Session.findById(req.session.id).user) {
            console.log('ensureAuth middleware pass')
            return next()}
        else {
            console.log('ensureAuth middleware fail')
            res.redirect('/login')}
    },
    checkManagerAuth: function async (req, res, next) {
        if (Session.findById(req.session.id)) {
            console.log('ensureManager middleware pass')
            return next()
        }
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
    },
    authenticateMiddleware(req, res, next) {
        // Check if the user has authenticated by looking for a specific cookie
        if (req.cookies.authenticated) {
          // If the cookie is present, set a flag on the request object to indicate that the user is authenticated
          req.authenticated = true;
        } else {
          // If the cookie is not present, set the flag to false
          req.authenticated = false;
        }
        // Call the next middleware in the chain
        next();
      }
}