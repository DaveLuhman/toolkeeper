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
const buildHeaderMap = (entries) => {
	if (!entries?.length) {
		return null;
	}
	const headers = entries[0].map((value) => value.trim().toLowerCase());
	const expected = ["prefix", "name", "description"];
	if (!expected.every((header) => headers.includes(header))) {
		return null;
	}
	return headers.reduce((acc, header, index) => {
		acc[header] = index;
		return acc;
	}, {});
};

const getCell = (row, headerMap, headerName, fallbackIndex) => {
	if (headerMap && headerMap[headerName] !== undefined) {
		return row[headerMap[headerName]];
	}
	return row[fallbackIndex];
};

const createCategoryDocument = (row, tenant, headerMap) => {
	const prefixValue = getCell(row, headerMap, "prefix", 0) || "";
	const nameValue = getCell(row, headerMap, "name", 1) || "";
	const descriptionValue = getCell(row, headerMap, "description", 2) || "";

	const prefix = prefixValue.trim();
	const name = nameValue.trim();
	const description = descriptionValue.trim();

	if (!prefix && !name) {
		return null;
	}

	return { prefix, name, description, tenant };
};

/**
 * Check if there is a duplicate category with the given prefix.
 *
 * @param {string} prefix - The prefix to check.
 * @returns {boolean} - True if a duplicate category exists, false otherwise.
 */
const checkDuplicateCategory = async (prefix) => {
	return checkDuplicate(Category, "prefix", prefix);
};

/**
 * Save a category document to the database.
 *
 * @param {Object} doc - The category document to save.
 * @returns {Promise} - A promise that resolves to the saved category document.
 */
const saveCategoryDocument = async (doc) => {
	if (!doc) {
		return;
	}
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
	const headerMap = buildHeaderMap(entries);
	const rows = headerMap ? entries.slice(1) : entries;

	const categoryPromises = rows.map((entry) => {
		const doc = createCategoryDocument(entry, tenant, headerMap);
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
