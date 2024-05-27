/**
 * Renders the settings page for users.
 *
 * @param {Object} _req - The request object.
 * @param {Object} res - The response object.
 */
export const renderSettingsUsers = (_req, res) => {
    res.render('settings/users')
}
/**
 * Renders the settings page for editing user information.
 *
 * @param {Object} _req - The request object.
 * @param {Object} res - The response object.
 */
export const renderSettingsEditUser = (_req, res) => {
    res.render('settings/editUser')
}