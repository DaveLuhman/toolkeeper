
import { csvFileToEntries } from '../util.js';

/**
 * Reads a CSV file and converts it to an array of entries.
 * @param {File} file - The CSV file to read.
 * @returns {Array} - An array of entries from the CSV file.
 */
export function readCSVFile(file) {
  return csvFileToEntries(file);
}

/**
 * Checks if a document with the given field value already exists in the collection.
 * @param {Model} model - The Mongoose model to check.
 * @param {string} field - The field to check for duplicates.
 * @param {string} value - The value to check for duplicates.
 * @returns {boolean} - True if a duplicate document exists, false otherwise.
 */
export async function checkDuplicate(model, field, value) {
  const results = await model.find({ [field]: value });
  return results.length !== 0;
}

/**
 * Saves a document to the database.
 * @param {Model} model - The Mongoose model to save.
 * @param {Object} doc - The document to save.
 * @param {Array} errorList - The list to store errors.
 * @returns {Promise} - A promise that resolves to the saved document.
 */
export async function saveDocument(model, doc, errorList) {
  try {
    const savedDoc = await model.create(doc);
    return savedDoc;
  } catch (error) {
    errorList.push({ key: doc._id, reason: error.message });
  }
}
