import passport from 'passport';

function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
        return next();
    }
    console.log('authenticated: ' + req.isAuthenticated());
    res.redirect('/login');
}
function isManager(req, res, next) {
    if (req.user.role == 'User') {
        res.status(401).send('Unauthorized');
        return next();
    }
    next();
}
function login(_req, _res, next) {
    passport.authenticate('local',
        {
            successRedirect: '/dashboard',
            failureRedirect: '/login',
            failureFlash: true
        });
    console.log('passport middleware');
    next();
}
function logout(req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
}
export { checkAuth, isManager, login, logout };