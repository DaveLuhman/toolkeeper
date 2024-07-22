import { getDashboardStats, getRecentlyUpdatedTools } from '../middleware/tool.js'
import { batchImportTools } from '../middleware/import/batch.js'
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
/**
 * Renders the edit tool page.
 * @param _req The request object (not used in this function).
 * @param res The response object used to render the page.
 */
export const renderDashboard = async (_req, res) => {
  try {
    res.locals.dashboardStats = await getDashboardStats()
    res.locals.recentlyUpdatedTools = await getRecentlyUpdatedTools()
    res.render('dashboard')
  } catch (err) {
    console.error(err)
    res.render('error/error')
  }
}

export const renderBatchCreationPage = (_req, res) => {
  res.render('batchCreate')
}

export const batchCreateTools = async (req, res) => {
  const {newTools, errorList} = await batchImportTools(req.body)
  console.log(newTools)
  res.locals.tools = newTools
  res.locals.errorList = errorList
  res.locals.message = `${errorList.length} failed to import.`
  res.render('results')
}
