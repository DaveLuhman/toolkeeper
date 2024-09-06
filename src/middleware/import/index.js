import { activateServiceAssignments, importServiceAssignments } from './serviceAssignment.js'
import { importTools } from './tool.js'
import { importHistory } from './history.js'
import { importCategories } from './categories.js'
import 'node:fs/promises'

/**
 * Imports data from a file.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
export async function importByFile(req, res, next) {
  console.log(req.body.importTarget)
  if (!req.files || !req.body.importTarget) {
    res.locals.error = 'No file uploaded or no selection made'
    res.render('settings/import', {
      message: 'No file uploaded or selection made'
    })
    return next('router')
  }
  const file = req.files.importFile
  const importTarget = req.body.importTarget
  const tenant = req.user.tenant.valueOf()
  let result = null;
  switch (importTarget) {
    case 'tools':
      console.log('importing tools')
      result = await importTools(file, tenant)
      break
    case 'allServiceAssignments':
      console.log('importing all service assignments')
      result = await importServiceAssignments(file, tenant)
      break
    case 'activeServiceAssignments':
      console.log('marking inactive SAs as such')
      result = await activateServiceAssignments(file, tenant)
      break
    case 'history':
      result = await importHistory(file, tenant)
      break
    case 'categories':
      console.log('importing categories')
      result = await importCategories(file, tenant)
      break
    default:
      res.locals.message = 'not sure how you managed this response.'
  }
  res.locals.message = `${result.successCount} successfully imported. ${result?.errorList?.length} failed to import`;
  res.locals.errorList = result.errorList;
  next()
}
