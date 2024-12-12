import { readCSVFile, checkDuplicate, saveDocument } from "./importUtils.js";
import { Category } from "../../models/index.models.js";
let successCount = 0;
const errorList = [];

/**
 * Create a category document from a row of data.
 *
 * @param {Array} row - The row of data.
 * @returns {Object} - The category document.
 */
const createCategoryDocument = (row, tenant) => {
	const data = row.map((cell) => cell.trim());
	const description = data[2] || "";
	return { prefix: data[0], name: data[1], description, tenant: tenant };
};

/**
 * Check if there is a duplicate category with the given prefix.
 *
 * @param {string} prefix - The prefix to check.
 * @returns {boolean} - True if a duplicate category exists, false otherwise.
 */
const checkDuplicateCategory = async (prefix) => {
	return await checkDuplicate(Category, "prefix", prefix);
};

/**
 * Save a category document to the database.
 *
 * @param {Object} doc - The category document to save.
 * @returns {Promise} - A promise that resolves to the saved category document.
 */
const saveCategoryDocument = async (doc) => {
	if (await checkDuplicateCategory(doc.prefix)) {
		errorList.push({ key: doc.prefix, reason: "Duplicate Prefix" });
		return;
	}
	const savedDoc = await saveDocument(Category, doc, errorList);
	if (savedDoc) {
		successCount++;
	}
};
/**
 *
 *
 * @param {*} entries
 * @return {*}
 */
function createCategories(entries, tenant) {
	const categoryPromises = entries.map((entry) => {
		const doc = createCategoryDocument(entry, tenant);
		return saveCategoryDocument(doc);
	});
	return Promise.all(categoryPromises);
}

/**
 * Imports categories from a file.
 *
 * @param {File} file - The file containing the categories data.
 * @returns {Object} - An object containing the success count and error list.
 */
export async function importCategories(file, tenant) {
	successCount = 0;
	errorList.length = 0;
	const entries = readCSVFile(file);
	await createCategories(entries, tenant);
	return { successCount, errorList };
}

// src\middleware\import\categories.js
