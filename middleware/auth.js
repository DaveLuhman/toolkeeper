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
async function login(req, res, next) {
    console.log('auth.login middleware');
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true })
        (req, res, function () {
            console.log('auth.login middleware: passport.authenticate');
            res.redirect('/dashboard');
        });
    }

function logout(req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
}
export { checkAuth, isManager, login, logout };