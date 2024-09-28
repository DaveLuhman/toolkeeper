import { Tool, Category } from '../../models/index.models.js';
import { readCSVFile, checkDuplicate, saveDocument } from './importUtils.js';

const errorList = [];
let successCount = 0;

/**
 * Mixes the given date and time into a single ISO string.
 * @param {string} date - The date in the format 'YYYY-MM-DD'.
 * @param {string} time - The time in the format 'HH:MM:SS'.
 * @returns {string} - The mixed date and time in ISO string format.
 */
function dateTimeMixer(date, time) {
  const returnValue = new Date(`${date} ${time}`).toISOString();
  return returnValue;
}

/**
 * Updates the service assignment for a tool based on the given row data.
 * @param {Array} row - The row data containing information about the tool and service assignment.
 * @returns {number} - Returns 0 if the update is successful, otherwise returns 1.
 */
async function updateToolServiceAssignment(row, tenant) {
  if (!row[3] || row[4] === null) return;
  const serialNumber = row[4].trim();
  const serviceAssignment = await ServiceAssignment.findOne({
    name: row[3],
    tenant
  });
  if (!serviceAssignment) {
    return 1; // error
  }
  const tool = await Tool.findOne({ serialNumber, tenant });
  if (!tool) {
    return 1; // error
  }
  const dateTime = dateTimeMixer(row[0], row[1]); // creates a date time object for when there was a relevant transaction
  await Tool.findByIdAndUpdate(
    { _id: tool.id },
    { serviceAssignment: serviceAssignment.id, updatedAt: dateTime },
    { new: true }
  );
  await ToolHistory.findByIdAndUpdate(
    tool._id,
    {
      $push: { history: tool },
      $inc: { __v: 1 }
    },
    { new: true }
  );
  return 0;
}

function trimArrayValues(array) {
  return array.map((cell) => cell.trim());
}

async function checkForDuplicates(serialNumber) {
  return await checkDuplicate(Tool, 'serialNumber', serialNumber);
}

function getPrefixFromToolID(toolID) {
  const prefix = toolID.substring(0, toolID.indexOf('-'));
  return prefix;
}

async function getCategoryByPrefix(prefix) {
  try {
    const category = await Category.find({ prefix }, '_id').exec();
    return category[0]?._id || '64a1c3d8d71e121dfd39b7ab';
  } catch (error) {
    return '64a1c3d8d71e121dfd39b7ab';
  }
}

function createToolDocument(row, tenant) {
  const trimmedRow = trimArrayValues(row);
  const toolDocument = {
    serialNumber: trimmedRow[0],
    barcode: trimmedRow[1],
    description: trimmedRow[2],
    modelNumber: trimmedRow[9],
    toolID: trimmedRow[10],
    manufacturer: trimmedRow[11],
    serviceAssignment: '64a19e910e675938ebb67de7',
    category: '64a1c3d8d71e121dfd39b7ab',
    tenant,
    history: [
      {
        updatedBy: tenant, // Assuming batch process initiates it
        updatedAt: new Date(),
        serviceAssignment: '64a19e910e675938ebb67de7',
        status: 'Created',
        changeDescription: 'Tool imported',
      },
    ],
  };
  return toolDocument;
}

/**
 * Creates a tool document and tracks history.
 */
async function createTool(toolDocument) {
  if (await checkForDuplicates(toolDocument.serialNumber)) {
    errorList.push({ key: toolDocument.serialNumber, reason: 'Duplicate serial number' });
    return;
  }
  toolDocument.category = await getCategoryByPrefix(getPrefixFromToolID(toolDocument.toolID));
  const savedDoc = await saveDocument(Tool, toolDocument, errorList);
  if (savedDoc) successCount++;
  return savedDoc;
}

/**
 * Processes all tools in the CSV and creates them in the database.
 */
export async function createTools(entries, tenant) {
  const toolPromises = entries.map((entry) => {
    const toolDocument = createToolDocument(entry, tenant);
    return createTool(toolDocument);
  });
  return Promise.allSettled(toolPromises);
}

/**
 * Imports tools from a file and tracks import history.
 */
export async function importTools(file, tenant) {
  successCount = 0;
  errorList.length = 0;
const entries = readCSVFile(file);
  await createTools(entries, tenant);
  return { successCount, errorList };
}
