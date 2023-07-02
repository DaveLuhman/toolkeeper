import Tool from '../../models/Tool.model.js'
import { csvFileToEntries } from '../util.js'
import ToolHistory from '../../models/ToolHistory.model.js'
let successCount
const errorList = []

function trimArrayValues (array) {
  return array.map(cell => cell.trim())
}

async function checkForDuplicates (serialNumber) {
  return await Tool.exists({ serialNumber })
}

async function createImportedTool (row) {
  row = trimArrayValues(row)
  const toolDocument = {
    serialNumber: row[0],
    barcode: row[1],
    description: row[2],
    modelNumber: row[9],
    toolID: row[10],
    manufacturer: row[11]
  }
  try {
    if (await checkForDuplicates(toolDocument.serialNumber)) {
      throw new Error('Duplicate serial number')
    }
    const tool = await new Tool(toolDocument).save()
    await ToolHistory.create({
      _id: tool._id
    })
    return successCount++
  } catch (error) {
    errorList.push({ key: toolDocument.serialNumber, reason: error.message })
    console.log(error)
  }
}
async function createTools(entries) {
  const toolPromises = entries.map(entry => {
    return createImportedTool(entry)
  })
  return Promise.allSettled(toolPromises)
}

export async function importTools (file) {
  successCount = 0
  errorList.length = 0
  const entries = csvFileToEntries(file)
  await createTools(entries)
  return { successCount, errorList }
}
