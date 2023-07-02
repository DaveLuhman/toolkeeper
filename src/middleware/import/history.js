import Tool from '../../models/Tool.model.js'
import ToolHistory from '../../models/ToolHistory.model.js'
import ServiceAssignmentModel from '../../models/ServiceAssignment.model.js'
import { csvFileToEntries } from '../util.js'
let successCount
const errorList = []

function dateTimeMixer (date, time) {
  const returnValue = new Date(`${date} ${time}`).toISOString()
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
  const dateTime = dateTimeMixer(row[0], row[1]) // creates a date time object for when there was a relavent transaction
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
  errorList.length = 0
  successCount = 0
  const transactions = csvFileToEntries(file)
  const updatedTools = []
  for (let i = 0; i < transactions.length; i++) {
    const result = await updateToolServiceAssignment(transactions[i])
    if (result === 0) {
      successCount = successCount + 1
    } else errorList.push({key: result})
  }
  return updatedTools.length
}
