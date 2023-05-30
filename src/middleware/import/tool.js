import Tool from '../../models/Tool.model.js'
import { importedFileToArrayByRow } from '../util.js'

async function createImportedTool (row) {
  const toolDocument = {
    serialNumber: row[0],
    barcode: row[1],
    description: row[2],
    modelNumber: row[9],
    toolID: row[10],
    manufacturer: row[11]
  }
  try{
  const newTool = (await Tool.create(toolDocument)).save
  return newTool.id
  } catch (err) {
    console.log(err)
  }

}

export function importTools (file) {
  const importDataParentArray = importedFileToArrayByRow(file)
  const tools = []
  importDataParentArray.forEach((row) => {
    return tools.push(row.split(','))
  })
  let newTools = []
  for (let i = 0; i < tools.length; i++) {
    newTools.push(createImportedTool(tools[i]))
  }
  return newTools.length + 'Tools added successfully.'
}

export function determineLastUpdatedTool (db) {
  let result
  const query =
    'SELECT x.scheckout FROM "TRANSACTION_HISTORY" x ORDER BY x.scheckout DESC LIMIT 1'
  return db.get(query, function (err, row) {
    result = row
  })
}
