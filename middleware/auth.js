import passport from 'passport';

function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}
function isManager(req, res, next) {
    if (req.user.role == 'User') {
        console.log('isManager: ' + req.user.role)
        res.status(401).send('Unauthorized');
        return next();
    }
    console.log('isManager: ' + req.user.role)
    next();
}
async function login(req, res, next) {
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true })
        (req, res, next);
        res.locals.user = req.user;
    }

function logout(req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
}
export { checkAuth, isManager, login, logout };