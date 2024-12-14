import { Tool } from '../../models/index.models.js'
const errorList = [];

/**
 * Represents an error that occurs when a duplicate value is encountered.
 * @class
 * @extends Error
 * @name DuplicateError
 */
class DuplicateError extends Error {
  constructor(message, options) {
    super(message);
    this.name = 'DuplicateError';
    this.cause = options.cause;
    this.duplicateValue = options.duplicateValue;
    this.existingTool = options.existingTool;
  }
}

/**
 * Checks if a tool with the given serial number already exists in the database.
 * @param {string} serialNumber - The serial number of the tool to check.
 * @returns {string|boolean} - The ID of the existing tool if found, or `false` if not found.
 */
const duplicateCheckSerial = async (serialNumber) => {
  const results = await Tool.find({ serialNumber });
  return results.length > 0 ? results[0].id : false;
};

/**
 * Checks if a barcode is already duplicated in the Tool collection.
 * @param {string} barcode - The barcode to check for duplication.
 * @returns {string|boolean} - The ID of the duplicated tool if found, otherwise false.
 */
const duplicateCheckBarcode = async (barcode) => {
  const results = await Tool.find({ barcode });
  return results.length > 0 ? results[0].id : false;
};

/**
 * Checks if a tool with the given toolID already exists in the database.
 * @param {string} toolID - The ID of the tool to check for duplicates.
 * @returns {string|boolean} - The ID of the existing tool if found, or `false` if not found.
 */
const duplicateCheckToolID = async (toolID) => {
  const results = await Tool.find({ toolID });
  return results.length > 0 ? results[0].id : false;
};

/**
 * Prepares batch data by transforming the provided JSON data into an array of tool objects.
 *
 * @param {Object} jsonData - The JSON data containing information about the tools.
 * @returns {Array} An array of tool objects.
 */
const prepareBatchData = (jsonData) => {
  try {
    const preparedToolObjects = [];
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
      tenant
    } = jsonData;

    const barcodes = barcode.split(',');
    const serialNumbers = serialNumber.split(',');
    const toolIDs = toolID.split(',');

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
        tenant,
        history: [
          {
            updatedBy: tenant,
            updatedAt: Date.now(),
            serviceAssignment,
            status: 'Created'
          }
        ]
      };
      preparedToolObjects.push(toolObject);
    }
    return preparedToolObjects;
  } catch (error) {
    errorList.push(error);
    throw error;
  }
};

/**
 * Creates a new tool batch and tracks its history.
 * @param {Object} toolObject - The tool object containing the properties of the tool.
 * @returns {Promise<Object>} - A promise that resolves to the newly created tool.
 */
const createBatchTool = async (toolObject) => {
  try {
    const duplicateSerial = await duplicateCheckSerial(toolObject.serialNumber);
    const duplicateBarcode = await duplicateCheckBarcode(toolObject.barcode);
    const duplicateToolID = await duplicateCheckToolID(toolObject.toolID);

    if (duplicateSerial) {
      throw new DuplicateError('Duplicate Serial Number', {
        cause: 'Serial Number already exists',
        duplicateValue: toolObject.serialNumber,
        existingTool: duplicateSerial
      });
    }

    if (duplicateBarcode) {
      throw new DuplicateError('Duplicate Barcode', {
        cause: 'Barcode already exists',
        duplicateValue: toolObject.barcode,
        existingTool: duplicateBarcode
      });
    }

    if (duplicateToolID) {
      throw new DuplicateError('Duplicate Tool ID', {
        cause: 'Tool ID already exists',
        duplicateValue: toolObject.toolID,
        existingTool: duplicateToolID
      });
    }

    const newTool = new Tool(toolObject);
    return await newTool.save();
  } catch (error) {
    errorList.push(error);
    throw error;
  }
};

/**
 * Creates batch tools asynchronously and tracks the history in the tool document.
 * @param {Array} toolObjectArray - An array of tool objects.
 * @returns {Promise<Array>} - A promise that resolves to an array of settled promises.
 */
const createBatchTools = async (toolObjectArray) => {
  const promises = toolObjectArray.map(toolObject => 
    createBatchTool(toolObject).catch(error => ({ error }))
  );
  return Promise.allSettled(promises);
};

/**
 * Imports tools in batch and tracks their creation history.
 * @param {Object} requestBody - The request body containing the tools to import.
 * @returns {Object} - An object containing the new tools and any errors that occurred during the import.
 */
const batchImportTools = async (requestBody) => {
  try {
    const toolObjectArray = prepareBatchData(requestBody);
    const results = await createBatchTools(toolObjectArray);
    return {
      newTools: results.filter(result => result.status === 'fulfilled').map(result => result.value),
      errors: errorList
    };
  } catch (error) {
    errorList.push(error);
    throw error;
  }
};

export {
  batchImportTools,
  createBatchTools,
  createBatchTool,
  prepareBatchData,
  duplicateCheckToolID,
  duplicateCheckBarcode,
  duplicateCheckSerial
};
