import { importServiceAssignments, countImportServiceAssignments } from './serviceAssignment.js'
import { countImportTools } from './tool.js'
import 'fs/promises'


export async function testImportFunction(req, res, next) {
  if (!req.files) return next();
  const serviceAssignmentImport = importServiceAssignments(req.files.importFile)
  console.log(JSON.stringify(serviceAssignmentImport))
  next()
}