/**
 * Renders the settings materials page.
 * @param _req The request object. Not used in this function.
 * @param res The response object, used to render the view.
 */
export const renderSettingsMaterials = (_req, res) => {
	res.render("settings/materials");
};
/**
 * Renders the edit material page for settings.
 * @param _req The request object. Not used in this function.
 * @param res The response object, used to render the view.
 */
export const renderSettingsEditMaterial = (_req, res) => {
	res.render("settings/editMaterial"); // render
};
// src\controllers\settings\material.js
