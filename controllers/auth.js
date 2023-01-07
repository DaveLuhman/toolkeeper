const passport = require('passport');

controller = {}

controller.validateLogin =  (_req , res, next) => {
    passport.authenticate('local', { successRedirect: '/dashboard', failureRedirect: '#' })}

  module.exports = controller