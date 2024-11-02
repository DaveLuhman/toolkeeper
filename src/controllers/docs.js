/**
 * Renders the login page.
 * @param {Object} res - The response object.
 */
export const renderDocsPage = (_req, res) => {
    res.render('docs/index', { layout: 'docs.hbs' });
}
/**
 * Renders the login page.
 * @param {Object} res - The response object.
 */
export const renderFaqPage = (_req, res) => {
    res.render('docs/faq', { layout: 'docs.hbs' });
}

/**
 * Renders the getting started page.
 * @param {Object} res - The response object.
 */
export const renderGettingStartedPage = (_req, res) => {
    res.render('docs/gettingStarted', { layout: 'docs.hbs' });
}
