import { ServiceAssignment } from "../../models/index.models.js";
import { readCSVFile, checkDuplicate, saveDocument } from "./importUtils.js";
let successCount = 0;
const errorList = [];

function determineServiceAssignmentType(cellValue) {
	const serviceAssignmentTypes = [
		"Contract Jobsite",
		"Service Jobsite",
		"Stockroom",
		"Vehicle",
		"Employee",
	];
	if (serviceAssignmentTypes.includes(cellValue)) {
		return cellValue;
	}
	return "Imported - Uncategorized";
}

async function createServiceAssignmentDocument(row, tenant) {
	try {
		if (!row || !tenant) {
			throw new Error("Missing required parameters: row or tenant");
		}
		if (!Array.isArray(row)) {
			throw new Error("Row must be an array");
		}
		if (!row[0] || row[0].trim() === "") {
			return null;
		}

		const jobNumber = row[0].trim() || "ERROR";
		const jobName = row[1] ? row[1].trim() : "";

		// Check for existing service assignments
		const existingAssignment = await ServiceAssignment.findOne({
			$or: [
				{ jobNumber: jobNumber, tenant },
				{ jobName: jobName, tenant },
			],
		});

		if (existingAssignment) {
			errorList.push(
				`Service Assignment already exists: ${jobNumber} - ${jobName}`,
			);
			return null;
		}

		const type = determineServiceAssignmentType(row[2]);
		const phone = row[3]?.trim();
		const notes = row[4]?.trim();
		return {
			jobNumber,
			jobName,
			notes,
			phone,
			type,
			active: true,
			tenant,
		};
	} catch (error) {
		errorList.push(
			`Error creating service assignment ${row[0]}: ${error.message}`,
		);
		return null;
	}
}

async function saveServiceAssignmentDocument(serviceAssignmentDocument) {
	if (!serviceAssignmentDocument) {
		return;
	}

	try {
		// Additional duplicate check right before saving (race condition protection)
		const isDuplicate = await ServiceAssignment.findOne({
			$or: [
				{
					jobNumber: serviceAssignmentDocument.jobNumber,
					tenant: serviceAssignmentDocument.tenant,
				},
				{
					jobName: serviceAssignmentDocument.jobName,
					tenant: serviceAssignmentDocument.tenant,
				},
			],
		});

		if (isDuplicate) {
			errorList.push(
				`Duplicate service assignment found: ${serviceAssignmentDocument.jobNumber} - ${serviceAssignmentDocument.jobName}`,
			);
			return;
		}

		const savedDoc = await saveDocument(
			ServiceAssignment,
			serviceAssignmentDocument,
			errorList,
		);
		if (savedDoc) {
			successCount++;
		}
	} catch (error) {
		errorList.push(
			`Error saving service assignment ${serviceAssignmentDocument.jobNumber}: ${error.message}`,
		);
	}
}

async function createServiceAssignments(serviceAssignmentEntries, tenant) {
	const serviceAssignmentsPromises = serviceAssignmentEntries.map(
		async (row) => {
			const serviceAssignmentDocument = await createServiceAssignmentDocument(
				row,
				tenant,
			);
			return saveServiceAssignmentDocument(serviceAssignmentDocument);
		},
	);
	return Promise.allSettled(serviceAssignmentsPromises);
}

/**
 * Imports service assignments from a CSV file
 * @param {File} file - The CSV file to import
 * @param {string} tenant - The tenant ID
 * @returns {Promise<{successCount: number, errorList: Array}>}
 */
export async function importServiceAssignments(file, tenant) {
	successCount = 0;
	const serviceAssignmentEntries = readCSVFile(file);
	await createServiceAssignments(serviceAssignmentEntries, tenant);
	return { successCount, errorList };
}

/**
 * Activates service assignments based on the provided file.
 * @param {string} file - The file containing the service assignments to activate.
 * @returns {Object} - An object containing the success count and error list.
 */
export async function activateServiceAssignments(file) {
	successCount = 0;
	const activeServiceRows = readCSVFile(file);
	const activatedSAs = await Promise.all(
		activeServiceRows.map((entry) => {
			return ServiceAssignment.findOneAndUpdate(
				{ jobNumber: entry[0] },
				{ active: true },
				{ new: true },
			);
		}),
	);
	return { successCount: activatedSAs.length, errorList };
}

// src\middleware\import\serviceAssignment.js
