import Tool from '../../models/Tool.model.js'
import ToolHistory from '../../models/ToolHistory.model.js'
import ServiceAssignmentModel from '../../models/ServiceAssignment.model.js'
import { importedFileToArrayByRow } from '../util.js'

async function updateToolServiceAssignment (row) {
  if (!row[3] || row[4] === null) return
  const serialNumber = row[4].trim()
  const serviceAssignment = await ServiceAssignmentModel.findOne({
    name: row[3]
  })
  if (!serviceAssignment) {
    return 1
  }
  const tool = await Tool.findOne({ serialNumber })
  if (!tool) {
    return 1
  }
  await Tool.findByIdAndUpdate(
    { _id: tool.id },
    { serviceAssignment: serviceAssignment.id },
    { new: true }
  )
  await ToolHistory.findByIdAndUpdate(
    tool._id,
    {
      $push: { history: tool },
      $inc: { __v: 1 }
    },
    { new: true }
  )
  return 0
}

export async function importHistory (file) {
  var failureCount = 0
  var successCount = 0
  const importDataParentArray = importedFileToArrayByRow(file)
  const transactions = []
  importDataParentArray.forEach((row) => {
    return transactions.push(row.split(','))
  })
  const updatedTools = []
  for (let i = 0; i < transactions.length; i++) {
    const result = await updateToolServiceAssignment(transactions[i])
    if (result == 0) {
      successCount = successCount + 1
    } else failureCount = failureCount + 1
    if (i % 150 == 0) {
      console.log(`${successCount} successfully imported so far.`)
      console.log(`${failureCount} failed to imported so far.`)
    }
  }
  return updatedTools.length
}
