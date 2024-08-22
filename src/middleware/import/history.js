import {Tool, ToolHistory, ServiceAssignment} from '../../models/index.models.js'

import { csvFileToEntries } from '../util.js'
let successCount = 0
const errorList = []

/**
 * Mixes the given date and time into a single ISO string.
 * @param {string} date - The date in the format 'YYYY-MM-DD'.
 * @param {string} time - The time in the format 'HH:MM:SS'.
 * @returns {string} - The mixed date and time in ISO string format.
 */
function dateTimeMixer(date, time) {
  const returnValue = new Date(`${date} ${time}`).toISOString()
  return returnValue
}

/**
 * Updates the service assignment for a tool based on the given row data.
 * @param {Array} row - The row data containing information about the tool and service assignment.
 * @returns {number} - Returns 0 if the update is successful, otherwise returns 1.
 */
async function updateToolServiceAssignment(row, tenant) {
  if (!row[3] || row[4] === null) return
  const serialNumber = row[4].trim()
  const serviceAssignment = await ServiceAssignment.findOne({
    name: row[3],
    tenant
  })
  if (!serviceAssignment) {
    return 1 // error
  }
  const tool = await Tool.findOne({ serialNumber, tenant })
  if (!tool) {
    return 1 // error
  }
  const dateTime = dateTimeMixer(row[0], row[1]) // creates a date time object for when there was a relevant transaction
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

/**
 * Imports the history from a file.
 * @param {string} file - The file to import the history from.
 * @returns {number} - The number of updated tools.
 */
export async function importHistory(file, tenant) {
  errorList.length = 0
  successCount = 0
  const transactions = csvFileToEntries(file)
  const updatedTools = []
  for (let i = 0; i < transactions.length; i++) {
    const result = await updateToolServiceAssignment(transactions[i], tenant)
    if (result === 0) {
      successCount = successCount + 1
    } else errorList.push({ key: result })
  }
  return updatedTools.length
}
