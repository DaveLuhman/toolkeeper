import { importServiceAssignments } from './serviceAssignment.js'
import { importTools } from './tool.js'
import { importHistory } from './history.js'
import { importCategories } from 'categories.js'
import 'fs/promises'

export async function importByFile (req, res, next) {
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
      result = importTools(file)
      break
    case 'serviceAssignment':
      result = importServiceAssignments(file)
      break
    case 'history':
      result = importHistory(file)
      break
    case 'categories':
      result = importCategories(file)
      break
    default:
      res.locals.message = 'not sure how you managed this response.'
  }
  res.locals.message = result
  next()
}
