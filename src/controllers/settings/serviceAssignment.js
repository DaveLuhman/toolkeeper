/**
 * Renders the service assignments settings page.
 * @param _req The HTTP request object, not used in this function.
 * @param res The HTTP response object used to render the page.
 */
export const renderSettingsServiceAssignments = (_req, res) => {
	res.render("settings/serviceAssignments");
};
/**
 * Renders the edit service assignment settings page.
 * @param _req The HTTP request object, not used in this function.
 * @param res The HTTP response object used to render the page.
 */
export const renderSettingsEditServiceAssignment = (_req, res) => {
	res.render("settings/editServiceAssignment");
};
// src\controllers\settings\serviceAssignment.js
