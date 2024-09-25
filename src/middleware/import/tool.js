import { Tool, Category } from '../../models/index.models.js';
import { csvFileToEntries } from '../util.js';

const errorList = [];
let successCount = 0;

function trimArrayValues(array) {
  return array.map((cell) => cell.trim());
}

async function checkForDuplicates(serialNumber) {
  const results = await Tool.find({ serialNumber });
  return results.length > 0;
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
  try {
    if (await checkForDuplicates(toolDocument.serialNumber)) {
      throw new Error('Duplicate serial number');
    }
    const tool = new Tool(toolDocument);
    tool.category = await getCategoryByPrefix(getPrefixFromToolID(tool.toolID));
    await tool.save();
    successCount++;
    return tool;
  } catch (error) {
    errorList.push({ key: toolDocument.serialNumber, reason: error.message });
    console.error(error.message);
  }
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
  const entries = csvFileToEntries(file);
  await createTools(entries, tenant);
  return { successCount, errorList };
}
