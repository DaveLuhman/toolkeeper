import {
	Tool,
	Category,
	ServiceAssignment,
} from "../../models/index.models.js";
import { readCSVFile, checkDuplicate, saveDocument } from "./importUtils.js";

const errorList = [];
let successCount = 0;

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

const buildHeaderMap = (entries) => {
	if (!entries?.length) {
		return null;
	}
	const headers = entries[0].map((value) => value.trim().toLowerCase());
	const expected = [
		"serialnumber",
		"barcode",
		"description",
		"modelnumber",
		"toolid",
		"manufacturer",
		"serviceassignment",
		"category",
	];
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

async function createToolDocument(row, tenant, headerMap) {
	if (!row || !row.length) {
		return null;
	}

	const serialNumber = (getCell(row, headerMap, "serialnumber", 0) || "").trim();
	const barcode = (getCell(row, headerMap, "barcode", 1) || "").trim();
	const description = (getCell(row, headerMap, "description", 2) || "").trim();
	const modelNumber = (getCell(row, headerMap, "modelnumber", 3) || "").trim();
	const toolID = (getCell(row, headerMap, "toolid", 4) || "").trim();
	const manufacturer = (getCell(row, headerMap, "manufacturer", 5) || "").trim();
	const serviceAssignmentValue = (
		getCell(row, headerMap, "serviceassignment", 6) || ""
	).trim();
	const categoryValue = (getCell(row, headerMap, "category", 7) || "").trim();

	if (!serialNumber && !barcode && !toolID) {
		return null;
	}

	// Validate required fields
	if (!serialNumber || !barcode || !toolID) {
		throw new Error(
			"Missing required fields: serialNumber, barcode, or toolID",
		);
	}

	// Find service assignment
	let serviceAssignment;
	try {
		if (serviceAssignmentValue) {
			serviceAssignment = await ServiceAssignment.findOne({
				$or: [
					{ jobNumber: serviceAssignmentValue, tenant },
					{ jobName: serviceAssignmentValue, tenant },
				],
			});
		}

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
		if (categoryValue) {
			category = await Category.findOne({
				$or: [
					{ prefix: categoryValue, tenant },
					{ name: categoryValue, tenant },
				],
			});
		}

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
		serialNumber,
		barcode,
		description,
		modelNumber,
		toolID,
		manufacturer,
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
	const headerMap = buildHeaderMap(entries);
	const rows = headerMap ? entries.slice(1) : entries;

	const toolPromises = rows.map(async (entry) => {
		const toolDocument = await createToolDocument(entry, tenant, headerMap);
		if (!toolDocument) {
			return null;
		}
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
