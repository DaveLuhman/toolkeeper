import { activateServiceAssignments, importServiceAssignments } from './serviceAssignment.js'
import { importTools } from './tool.js'
import { importHistory } from './history.js'
import { importCategories } from './categories.js'
import 'fs/promises'

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
  let result
  switch (importTarget) {
    case 'tools':
      console.log('importing tools')
      result = await importTools(file)
      break
    case 'allServiceAssignments':
      console.log('importing all service assignments')
      result = await importServiceAssignments(file)
      break
    case 'activeServiceAssignments':
      console.log('marking inactive SAs as such')
      result = await activateServiceAssignments(file)
      break
    case 'history':
      result = await importHistory(file)
      break
    case 'categories':
      console.log('importing categories')
      result = await importCategories(file)
      break
    default:
      res.locals.message = 'not sure how you managed this response.'
  }
  res.locals.message =
    result.successCount +
    ' successfully imported.  ' +
    result?.errorList?.length +
    ' failed to import'
  res.locals.errorList = result.errorList
  next()
}
