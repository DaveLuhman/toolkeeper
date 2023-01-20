const passport = require('passport');

module.exports = {
    checkAuth: (req, res, next) => {
        if (req.isAuthenticated()) {
            res.locals.user = req.user;
            return next();
        }
        console.log('authenticated: ' + req.isAuthenticated())
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
                successRedirect: '/dashboard',
                failureRedirect: '/login',
                failureFlash: true
            })
            console.log('passport middleware')
        next()
    },
    logout: (req, res, next) => {
        req.logout(function (err) {
            if (err) { return next(err); }
            res.redirect('/');
        });
    }
}