import { importServiceAssignments } from './serviceAssignment.js'
import { importTools } from './tool.js'
import 'fs/promises'

export async function importByFile (req, res, next) {
  const file = req.files.importFile
  if (!req.files) {
    res.locals.message = 'No File to import'
    return next()
  }
  const { importTarget } = req.body.importTarget
  let result
  switch (importTarget) {
    case 'tools':
      result = importTools(file)
      break
    case 'serviceAssignment':
      result = importServiceAssignments(file)
      break
    case 'categories':
      result = importCategories(file)
      break
    case undefined:
      res.locals.message = 'You must specify what you plan to import'
      break
    default:
      res.locals.message = 'not sure how you managed this response.'
  }
  res.locals.message = result
  next()
}
