export const renderLandingPage = (_req, res) => {
    res.render('index', { layout: 'public.hbs' })
}

export const renderLoginPage = (req, res) => {
 res.render('login', { layout: 'auth.hbs' });
}
export const redirectToDashboard = (_req, res) => {
    res.redirect('/dashboard')
}

export const renderRegisterPage = (_req, res) => {
    res.render('register', { layout: 'auth.hbs' })
}