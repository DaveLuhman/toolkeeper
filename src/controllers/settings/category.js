

/** 
 * Renders the settings categories page.
 * @param _req The request object, not used in this function.
 * @param res The response object used to render the page.
 */
export const renderSettingsCategories = (_req, res) => {
    res.render('settings/categories')
}

/** 
 * Renders the edit category page for settings.
 * @param _req The request object, not used in this function.
 * @param res The response object used to render the page.
 */
export const renderSettingsEditCategory = (_req, res) => {
    res.render('settings/editCategory')
}

// src\controllers\settings\category.js
