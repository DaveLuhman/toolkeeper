import Tool from '../../models/Tool.model.js'
import ToolHistory from '../../models/ToolHistory.model.js'
import { importedFileToArrayByRow } from '../util.js'

function trimArrayValues (array) {
  for (let i = 0; i < array.length; i++) {
    array[i] = array[i].trim()
  }
  return array
}
async function lookupTool (serialNumber) {
  return Tool.findOne({ serialNumber })
}
async function checkForDuplicates (serialNumber) {
  return await lookupTool(serialNumber)
    .then((result) => {
      if (!result) return false // didn't find anything, so lookup is falsey
      else return true
    }) // found a duplicate serial number
    .catch((err) => {
      return err + 'error occured'
    })
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
    const newTool = await Tool.create(toolDocument)
    await ToolHistory.create({
      _id: newTool._id,
      history: [newTool]
    })
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
  const newTools = []
  for (let i = 0; i < tools.length; i++) {
    newTools.push(createImportedTool(tools[i]))
  }
  return newTools.length + ' Tools Submitted for import.'
}
