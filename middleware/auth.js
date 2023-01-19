const passport = require('passport');

module.exports = {
    checkAuth: (req, res, next) => {
        if (req.isAuthenticated()) {
            res.locals.user = req.user;
            res.locals.pagination = { pageCount: 0 };
            return next();
        }
        res.redirect('/login');
    },
    login: (_req, _res, next) => {
        passport.authenticate('local',
            {
                successRedirect: '/dashboard',
                failureRedirect: '/login',
                failureFlash: true
            })
            next()
    },
    logout: (req, res, next) => {
        req.logout(function (err) {
            if (err) { return next(err); }
            res.redirect('/');
        });
    }
}