import { Tool, ToolHistory, Category } from '../../models/index.models.js'
import { csvFileToEntries } from '../util.js'

const errorList = []

function trimArrayValues(array) {
  return array.map((cell) => cell.trim())
}

async function checkForDuplicates(serialNumber) {
  const results = await Tool.find({ serialNumber })
  return results.length > 0
}

function getPrefixFromToolID(toolID) {
  const prefix = toolID.substring(0, toolID.indexOf('-'))
  return prefix
}

async function getCategoryByPrefix(prefix) {
  try {
    const category = await Category.find({ prefix }, '_id').exec()
    return category[0]._id || '64a1c3d8d71e121dfd39b7ab'
  } catch (error) {
    return '64a1c3d8d71e121dfd39b7ab'
  }
}

function createToolDocument(row, tenant) {
  row = trimArrayValues(row)
  const toolDocument = {
    serialNumber: row[0],
    barcode: row[1],
    description: row[2],
    modelNumber: row[9],
    toolID: row[10],
    manufacturer: row[11],
    serviceAssignment: '64a19e910e675938ebb67de7',
    category: '64a1c3d8d71e121dfd39b7ab',
    tenant,
  }
  return toolDocument
}
//* @param {Array} entries An array of tool entries to be created.
//* @returns {Promise} A promise that resolves when all tools have been created.
async function createTool(toolDocument) {
  try {
    if (await checkForDuplicates(toolDocument.serialNumber)) {
      throw new Error('Duplicate serial number')
    }
    const tool = new Tool(toolDocument)
    tool.category = await getCategoryByPrefix(getPrefixFromToolID(tool.toolID))
    await tool.save()
    await ToolHistory.create({
      _id: tool._id,
    })
    return successCount++
  } catch (error) {
    errorList.push({ key: toolDocument.serialNumber, reason: error.message })
    console.log(error)
  }
}
export function createTools(entries, tenant) {
  const toolPromises = entries.map((entry) => {
    const toolDocument = createToolDocument(entry, tenant)
    return createTool(toolDocument)
  })
  return Promise.allSettled(toolPromises)
}
export async function importTools(file, tenant) {
  successCount = 0
  errorList.length = 0
  const entries = csvFileToEntries(file)
  await createTools(entries, tenant)
  return { successCount, errorList }
}


