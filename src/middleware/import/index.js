import { importServiceAssignments } from './serviceAssignment.js'
import { countImportTools } from './tool.js'
import 'fs/promises'


export async function testImportFunction(req, res, next) {
  if (!req.files) return next();
  const serviceAssignmentImport = importServiceAssignments(req.files.importFile)
  res.locals.message = JSON.stringify(serviceAssignmentImport)
  next()
}