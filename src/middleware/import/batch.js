import Tool from '../../models/Tool.model.js'
import ToolHistory from '../../models/ToolHistory.model.js'
const errorList = []

async function checkForDuplicates(serialNumber) {
    const results = await Tool.find({ serialNumber })
    return results.length > 0
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
    for(let i=0;i<serialNumbers.length; i++) {
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
    if (await checkForDuplicates(toolObject.serialNumber)) {
      throw new Error('Duplicate serial number')
    }
    const newTool = await Tool.create(toolObject)
    console.log(`New Tool Created: ${newTool}`)
    await ToolHistory.create({
      _id: newTool._id,
    })
    return newTool
  } catch (error) {
    errorList.push({ key: toolObject.serialNumber, reason: error.message })
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
    .filter((tool) => tool.status === 'fulfilled')
    .map((tool) => tool.value)
  return { newTools, errorList }
}
