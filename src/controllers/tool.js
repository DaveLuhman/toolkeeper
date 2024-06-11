
/**
 * Renders the results page.
 * @param {object} req The request object.
 * @param {object} res The response object. Used to render the 'results' page.
 */
export const renderResults = (req, res) => {
    res.render('results')
}
/**
 * Renders the status change confirmation page.
 * @param {object} _req The request object.
 * @param {object} res The response object. Used to render the status change confirmation page.
 */
export const renderStatusChangeConfirmationPage = (_req, res) => {
    res.render('checkInOut')
}

/**
 * Renders the edit tool page.
 * @param _req The request object (not used in this function).
 * @param res The response object used to render the page.
 */
export const renderEditTool = (_req, res) => {
    res.render('editTool')
}
