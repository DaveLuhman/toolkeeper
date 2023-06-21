import Tool from '../../models/Tool.model.js'
import ToolHistory from '../../models/ToolHistory.model.js'
import ServiceAssignmentModel from '../../models/ServiceAssignment.model.js'
import { importedFileToArrayByRow } from '../util.js'


function dateTimeMixer(date, time) {
  let returnValue = new Date(`${date} ${time}`).toISOString()
  return returnValue
}

async function updateToolServiceAssignment (row) {
  if (!row[3] || row[4] === null) return
  const serialNumber = row[4].trim()
  const serviceAssignment = await ServiceAssignmentModel.findOne({
    name: row[3]
  })
  if (!serviceAssignment) {
    return 1 // error
  }
  const tool = await Tool.findOne({ serialNumber })
  if (!tool) {
    return 1 // error
  }
  const dateTime = dateTimeMixer(row[0], row[1])
  await Tool.findByIdAndUpdate(
    { _id: tool.id },
    { serviceAssignment: serviceAssignment.id, updatedAt: dateTime },
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
  let failureCount = 0
  let successCount = 0
  const importDataParentArray = importedFileToArrayByRow(file)
  const transactions = []
  importDataParentArray.forEach((row) => {
    return transactions.push(row.split(','))
  })
  const updatedTools = []
  for (let i = 0; i < transactions.length; i++) {
    const result = await updateToolServiceAssignment(transactions[i])
    if (result === 0) {
      successCount = successCount + 1
    } else failureCount = failureCount + 1
  }
  return updatedTools.length
}
