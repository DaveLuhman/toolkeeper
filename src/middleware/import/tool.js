import {
	Tool,
	Category,
	ServiceAssignment,
} from "../../models/index.models.js";
import { readCSVFile, checkDuplicate, saveDocument } from "./importUtils.js";

const errorList = [];
let successCount = 0;

function trimArrayValues(array) {
	return array.map((cell) => cell.trim());
}

async function checkForDuplicates(serialNumber, toolId, barcode) {
	const duplicateChecks = [
		{ field: "serialNumber", value: serialNumber },
		{ field: "toolId", value: toolId },
		{ field: "barcode", value: barcode },
	];

	for (const check of duplicateChecks) {
		if (!check.value) {
    continue;
  } // Skip empty values
		const isDuplicate = await checkDuplicate(Tool, check.field, check.value);
		if (isDuplicate) {
			throw new Error(`Duplicate ${check.field} found: ${check.value}`);
		}
	}
	return false; // No duplicates found
}

async function createToolDocument(row, tenant) {
	// Validate required fields
	if (!row[0] || !row[1] || !row[4]) {
		throw new Error(
			"Missing required fields: serialNumber, barcode, or toolID",
		);
	}

	const trimmedRow = trimArrayValues(row);

	// Find service assignment
	let serviceAssignment;
	try {
		serviceAssignment = await ServiceAssignment.findOne({
			$or: [
				{ jobNumber: trimmedRow[6], tenant },
				{ jobName: trimmedRow[6], tenant },
			],
		});

		if (!serviceAssignment) {
			serviceAssignment = await ServiceAssignment.findOne({
				jobNumber: "IMPORT",
				tenant,
			});
		}
	} catch (error) {
		throw new Error(`Error finding service assignment: ${error.message}`);
	}

	// Find category
	let category;
	try {
		category = await Category.findOne({
			$or: [
				{ prefix: trimmedRow[7], tenant },
				{ name: trimmedRow[7], tenant },
			],
		});

		if (!category) {
			category = await Category.findOne({
				name: "Uncategorized",
				tenant,
			});
		}
	} catch (error) {
		throw new Error(`Error finding category: ${error.message}`);
	}

	return {
		serialNumber: trimmedRow[0],
		barcode: trimmedRow[1],
		description: trimmedRow[2],
		modelNumber: trimmedRow[3],
		toolID: trimmedRow[4],
		manufacturer: trimmedRow[5],
		serviceAssignment,
		category,
		tenant,
		history: [
			{
				updatedAt: new Date(),
				serviceAssignment,
				status: "Created",
				changeDescription: "Tool imported",
			},
		],
	};
}

/**
 * Creates a tool document and tracks history.
 */
async function createTool(toolDocument) {
	if (
		await checkForDuplicates(
			toolDocument.serialNumber,
			toolDocument.toolID,
			toolDocument.barcode,
		)
	) {
		errorList.push({
			key: toolDocument.serialNumber,
			reason: "Duplicate serial number, toolID, or barcode",
		});
		return;
	}
	const savedDoc = await saveDocument(Tool, toolDocument, errorList);
	if (savedDoc) {
		successCount++;
	}
	return savedDoc;
}

/**
 * Processes all tools in the CSV and creates them in the database.
 */
export async function createTools(entries, tenant) {
	const toolPromises = entries.map(async (entry) => {
		const toolDocument = await createToolDocument(entry, tenant);
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
