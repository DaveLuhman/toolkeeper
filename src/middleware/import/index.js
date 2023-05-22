import { importServiceAssignments, countImportServiceAssignments } from './serviceAssignment.js'
import { countImportTools } from './tool.js'
import * as fs from 'fs';

function preimportDataCollection(req, res, next) {
  const data = req.file.importFile
  const predictedImportedServiceAssignments = countImportServiceAssignments(db)
  const predictedImportedTools = countImportTools(db)
}
export function testImportFunction(req, res, next) {
  console.table(req.body)
  console.log(req.files.importFile)
  next()
}

const sampleUploadedFile = {
  name: '_MEMBER__20230521.csv',
  data: Buffer ,
  size: 100912,
  encoding: '7bit',
  tempFilePath: '\\tmp\\tmp-2-1684731682753',
  truncated: false,
  mimetype: 'text/csv',
  md5: '2616e22710d0a00462a9f2fe528fc76f',
}