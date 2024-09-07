import { Tool, ToolHistory} from '../../models/index.models.js'
const errorList = []
/**
 * Represents an error that occurs when a duplicate value is encountered.
 * @class
 * @extends Error
 * @name DuplicateError
 */
class DuplicateError extends Error {
  constructor(message, options) {
    super(message)
    this.name = 'DuplicateError'
    this.cause = options.cause
    this.duplicateValue = options.duplicateValue
    this.existingTool = options.existingTool
  }
}
/**
 * Checks if a tool with the given serial number already exists in the database.
 * @param {string} serialNumber - The serial number of the tool to check.
 * @returns {string|boolean} - The ID of the existing tool if found, or `false` if not found.
 */
async function duplicateCheckSerial(serialNumber) {
  const results = await Tool.find({ serialNumber })
  if (results.length > 0) return results[0].id
  return false
}
/**
 * Checks if a barcode is already duplicated in the Tool collection.
 * @param {string} barcode - The barcode to check for duplication.
 * @returns {string|boolean} - The ID of the duplicated tool if found, otherwise false.
 */
async function duplicateCheckBarcode(barcode) {
  const results = await Tool.find({ barcode })
  if (results.length > 0) return results[0].id
  return false
}
/**
 * Checks if a tool with the given toolID already exists in the database.
 * @param {string} toolID - The ID of the tool to check for duplicates.
 * @returns {string|boolean} - The ID of the existing tool if found, or `false` if not found.
 */
async function duplicateCheckToolID(toolID) {
  const results = await Tool.find({ toolID })
  if (results.length > 0) return results[0].id
  return false
}

/**
 * Prepares batch data by transforming the provided JSON data into an array of tool objects.
 *
 * @param {Object} jsonData - The JSON data containing information about the tools.
 * @param {string} jsonData.barcode - The barcodes of the tools, separated by commas.
 * @param {string} jsonData.serialNumber - The serial numbers of the tools, separated by commas.
 * @param {string} jsonData.toolID - The tool IDs of the tools, separated by commas.
 * @returns {Array} An array of tool objects.
 */
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
/**
 * Creates a new tool batch.
 *
 * @param {Object} toolObject - The tool object containing the properties of the tool.
 * @returns {Promise<Object>} - A promise that resolves to the newly created tool.
 */
async function createBatchTool(toolObject) {
  const { serialNumber, barcode, toolID } = toolObject
  try {
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

/**
 * Creates batch tools asynchronously.
 *
 * @param {Array} toolObjectArray - An array of tool objects.
 * @returns {Promise<Array>} - A promise that resolves to an array of settled promises.
 */
async function createBatchTools(toolObjectArray) {
  const toolPromises = toolObjectArray.map((obj) => {
    const tool = createBatchTool(obj)
    return tool
  })
  return await Promise.allSettled(toolPromises)
}

/**
 * Imports tools in batch.
 *
 * @param {Object} requestBody - The request body containing the tools to import.
 * @returns {Object} - An object containing the new tools and any errors that occurred during the import.
 */
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
