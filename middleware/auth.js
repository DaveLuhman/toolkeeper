const passport = require('passport');

module.exports = {
    checkAuth: (req, res, next) => {
        if (req.isAuthenticated()) {
            res.locals.user = req.user;
            return next();
        }
        res.redirect('/login');
    },
    isManager: (req, res, next) => {
        if (req.user.role == 'User') {
            res.status(401).send('Unauthorized');
            return next()
        }
        next();
    },
    login: (_req, _res, next) => {
        passport.authenticate('local',
            {
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