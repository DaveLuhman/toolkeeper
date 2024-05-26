/**
 * Renders the landing page.
 * @param {Object} _req - The request object.
 * @param {Object} res - The response object.
 */
export const renderLandingPage = (_req, res) => {
    res.render('index', { layout: 'public.hbs' })
}

/**
 * Renders the login page.
 * @param {Object} res - The response object.
 */
export const renderLoginPage = (_req, res) => {
    res.render('login', { layout: 'auth.hbs' });
}

/**
 * Redirects to the dashboard.
 * @param {Object} _req - The request object.
 * @param {Object} res - The response object.
 */
export const redirectToDashboard = (_req, res) => {
    res.redirect('/dashboard')
}

/**
 * Renders the register page.
 * @param {Object} _req - The request object.
 * @param {Object} res - The response object.
 */
export const renderRegisterPage = (_req, res) => {
    res.render('register', { layout: 'auth.hbs' })
}