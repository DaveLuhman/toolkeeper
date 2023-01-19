const router = require('express').Router()
const { login, logout } = require('../middleware/auth')
const t = require('../controllers/tool')


router.get('/', (_req, res) => { res.render('index', { layout: 'public.hbs' }); }); // Render Public Landing Page

router.post('/submitFile', t.importFromCSV); // Import Tool Data from CSV
// Render Login Page
router.get('/login', (req, res) => {
    if (req.isAuthenticated()) { res.redirect('/dashboard'); }
    else {
        res.render('login', { layout: 'login.hbs' });
    }
});
 // Login User
router.post('/login', login, (_req, res) => {
    res.render('dashboard')});
// Logout User
router.get('/logout', logout);

module.exports = router;