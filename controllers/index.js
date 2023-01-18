const passport = require("passport");

const controller = {};

controller.getIndex = (req, res) => {
    res.render('index', { layout: 'public.hbs' });
};

controller.getLoginPage = (req, res) => {
    if(req.isAuthenticated()) { res.redirect('/dashboard'); }
    else {
    res.render('login', { layout: 'login.hbs'}); }
};

controller.postLoginPage = (req, res, next) => passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
})(req, res, next);

controller.logUserOut = (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
};

module.exports = controller;