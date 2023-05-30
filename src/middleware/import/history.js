import Tool from '../../models/Tool.model.js'
import ServiceAssignmentModel from '../../models/ServiceAssignment.model.js'
import { importedFileToArrayByRow } from '../util.js'

async function lookupTool (barcode) {
  return await Tool.findOne({ barcode })
}

async function updateToolServiceAssignment (row) {
  const barcode = row[0]
  const serviceAssignment = await ServiceAssignmentModel.findOne({ name: row[1] })
  const tool = await lookupTool(barcode)
  tool.serviceAssignment = serviceAssignment.id
  tool.save()
  return 0
}

export async function importHistory (file) {
  const importDataParentArray = importedFileToArrayByRow(file)
  const transactions = []
  importDataParentArray.forEach((row) => {
    return transactions.push(row.split(','))
  })
  const updatedTools = []
  for (let i = 0; i < transactions.length; i++) {
    updatedTools.push(await updateToolServiceAssignment(transactions[i]))
  }
  return updatedTools.length
}
