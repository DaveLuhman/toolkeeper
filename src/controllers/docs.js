/**
 * Renders the login page.
 * @param {Object} res - The response object.
 */
export const renderDocsPage = (_req, res) => {
    res.render('docs/index', { layout: 'public.hbs' });
}
/**
 * Renders the login page.
 * @param {Object} res - The response object.
 */
export const renderFaqPage = (_req, res) => {
    res.render('docs/faq', { layout: 'public.hbs' });
}

/**
 * Renders the getting started page.
 * @param {Object} res - The response object.
 */
export const renderGettingStartedPage = (_req, res) => {
    res.render('docs/gettingStarted', { layout: 'public.hbs' });
}
