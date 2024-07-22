import Tool from '../../models/Tool.model.js'
import ToolHistory from '../../models/ToolHistory.model.js'
const errorList = []
class DuplicateError extends Error {
  constructor(message, options) {
    super(message)
    this.name = 'DuplicateError'
    this.cause = options.cause
    this.duplicateValue = options.duplicateValue,
    this.existingTool = options.existingTool
  }
}
async function duplicateCheckSerial(serialNumber) {
  const results = await Tool.find({ serialNumber })
  if(results.length > 0) return results[0].id
  else return false
}
async function duplicateCheckBarcode(barcode) {
  const results = await Tool.find({ barcode })
  if(results.length > 0) return results[0].id
  else return false
}
async function duplicateCheckToolID(toolID) {
  const results = await Tool.find({ toolID })
  if(results.length > 0) return results[0].id
  else return false
}

function prepareBatchData(jsonData) {
  try {
    const preparedToolObjects = []
    const {
      category,
      serviceAssignment,
      modelNumber,
      manufacturer,
      width,
      length,
      height,
      weight,
      barcode,
      serialNumber,
      description,
      toolID,
    } = jsonData
    const barcodes = barcode.split(',')
    const serialNumbers = serialNumber.split(',')
    const toolIDs = toolID.split(',')
    for (let i = 0; i < serialNumbers.length; i++) {
      const toolObject = {
        serialNumber: serialNumbers[i],
        barcode: barcodes[i],
        description,
        modelNumber,
        toolID: toolIDs[i],
        manufacturer,
        serviceAssignment,
        category,
        size: { width, length, height, weight },
      }
      preparedToolObjects.push(toolObject)
    }
    return preparedToolObjects
  } catch (error) {
    console.log(error)
  }
}
async function createBatchTool(toolObject) {
  try {
    const { serialNumber, barcode, toolID } = toolObject
    const duplicateSerial = await duplicateCheckSerial(serialNumber)
    if (duplicateSerial) {
      throw new DuplicateError(`Duplicate serial number: ${serialNumber}`, { cause: 'Serial Number', duplicateValue: serialNumber, existingTool: duplicateSerial })
    }
    const duplicateBarcode = await duplicateCheckBarcode(barcode)
    if (duplicateBarcode) {
      throw new DuplicateError(`Duplicate barcode: ${barcode}`, { cause: 'Barcode', duplicateValue: barcode, existingTool: duplicateBarcode })
    }
    const duplicateToolID = await duplicateCheckToolID(toolID)
    if (duplicateToolID) {
      throw new DuplicateError(`Duplicate toolID: ${toolID}`, { cause: 'Tool ID', duplicateValue: toolID, existingTool: duplicateToolID })
    }
    const newTool = await Tool.create(toolObject)
    console.log(`New Tool Created: ${newTool}`)
    await ToolHistory.create({
      _id: newTool._id,
    })
    return newTool
  } catch (error) {
    errorList.push(error)
    console.log(error)
  }
}

async function createBatchTools(toolObjectArray) {
  const toolPromises = toolObjectArray.map((obj) => {
    const tool = createBatchTool(obj)
    return tool
  })
  return await Promise.allSettled(toolPromises)
}

export async function batchImportTools(requestBody) {
  errorList.length = 0
  const preparedToolObjects = prepareBatchData(requestBody)
  const toolPromises = await createBatchTools(preparedToolObjects)
  const newTools = toolPromises
    .filter((tool) => tool !== undefined)
    .filter((tool) => tool.status === 'fulfilled')
    .map((tool) => tool.value)
  return { newTools, errorList }
}
