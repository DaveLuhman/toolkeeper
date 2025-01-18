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
/**
 * Renders the tool management page.
 * @param {Object} res - The response object.
 */
export const renderToolManagementPage = (_req, res) => {
    res.render('docs/toolManagement', { layout: 'docs.hbs' });
}
/**
 * Renders the tool management page.
 * @param {Object} res - The response object.
 */
export const renderServiceAssignmentPage = (_req, res) => {
    res.render('docs/serviceAssignment', { layout: 'docs.hbs' });
}
