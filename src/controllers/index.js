/**
 * Renders the landing page.
 * @param {Object} _req - The request object.
 * @param {Object} res - The response object.
 */
export const renderLandingPage = (_req, res) => {
    res.status(200).render('index', { layout: 'public.hbs' })
}

/**
 * Renders the login page.
 * @param {Object} res - The response object.
 */
export const renderLoginPage = (_req, res) => {
    res.render('auth/login', { layout: 'auth.hbs' });
}

/**
 * Redirects to the dashboard.
 * @param {Object} _req - The request object.
 * @param {Object} res - The response object.
 */
export const redirectToDashboard = (req, res) => {
    res.redirect('/dashboard')
}

/**
 * Renders the register page.
 * @param {Object} _req - The request object.
 * @param {Object} res - The response object.
 */
export const renderRegisterPage = (_req, res) => {
    res.render('auth/register', { layout: 'auth.hbs' })
}
// src\controllers\index.js
