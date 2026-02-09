import {
	Category,
	ServiceAssignment,
	Tool,
} from "../../models/index.models.js";

/**
 * Escapes a value for safe CSV output.
 * Wraps in double quotes if the value contains a comma, double quote, or newline.
 * @param {*} value
 * @returns {string}
 */
function csvEscape(value) {
	if (value === null || value === undefined) {
		return "";
	}
	const str = String(value);
	if (str.includes(",") || str.includes('"') || str.includes("\n")) {
		return `"${str.replace(/"/g, '""')}"`;
	}
	return str;
}

/**
 * Converts an array of row arrays into a CSV string.
 * @param {string[]} headers
 * @param {Array<Array>} rows
 * @returns {string}
 */
function buildCsv(headers, rows) {
	const lines = [headers.join(",")];
	for (const row of rows) {
		lines.push(row.map(csvEscape).join(","));
	}
	return lines.join("\r\n");
}

/**
 * Renders the export page.
 */
export const renderSettingsExport = (_req, res) => {
	res.render("settings/export");
};

/**
 * Exports categories as a CSV download.
 */
export const exportCategories = async (req, res) => {
	try {
		const categories = await Category.find({
			tenant: req.user.tenant.valueOf(),
		})
			.sort("prefix")
			.lean();

		const headers = ["prefix", "name", "description"];
		const rows = categories.map((cat) => [
			cat.prefix || "",
			cat.name || "",
			cat.description || "",
		]);

		const csv = buildCsv(headers, rows);
		res.setHeader("Content-Type", "text/csv");
		res.setHeader(
			"Content-Disposition",
			"attachment; filename=categories.csv",
		);
		res.send(csv);
	} catch (error) {
		req.logger.error({
			message: "Failed to export categories",
			error: error.message,
		});
		res.status(500).send("Export failed");
	}
};

/**
 * Exports service assignments as a CSV download.
 */
export const exportServiceAssignments = async (req, res) => {
	try {
		const serviceAssignments = await ServiceAssignment.find({
			tenant: req.user.tenant.valueOf(),
		})
			.sort("jobNumber")
			.lean();

		const headers = ["jobNumber", "jobName", "type", "phone", "notes"];
		const rows = serviceAssignments.map((sa) => [
			sa.jobNumber || "",
			sa.jobName || "",
			sa.type || "",
			sa.phone || "",
			sa.notes || "",
		]);

		const csv = buildCsv(headers, rows);
		res.setHeader("Content-Type", "text/csv");
		res.setHeader(
			"Content-Disposition",
			"attachment; filename=service_assignments.csv",
		);
		res.send(csv);
	} catch (error) {
		req.logger.error({
			message: "Failed to export service assignments",
			error: error.message,
		});
		res.status(500).send("Export failed");
	}
};

/**
 * Exports tools as a CSV download.
 * Reads serviceAssignment.jobNumber and category.prefix directly from
 * auto-populated fields so the CSV values match what the importer expects.
 */
export const exportTools = async (req, res) => {
	try {
		const tenantId = req.user.tenant.valueOf();

		// serviceAssignment and category are auto-populated by mongoose-autopopulate
		const tools = await Tool.find({ tenant: tenantId }).lean();

		const headers = [
			"serialNumber",
			"barcode",
			"description",
			"modelNumber",
			"toolID",
			"manufacturer",
			"serviceAssignment",
			"category",
		];

		const rows = tools.map((tool) => {
			const sa = tool.serviceAssignment;
			const cat = tool.category;
			return [
				tool.serialNumber || "",
				tool.barcode || "",
				tool.description || "",
				tool.modelNumber || "",
				tool.toolID || "",
				tool.manufacturer || "",
				sa ? sa.jobNumber || sa.jobName || "" : "",
				cat ? cat.prefix || cat.name || "" : "",
			];
		});

		const csv = buildCsv(headers, rows);
		res.setHeader("Content-Type", "text/csv");
		res.setHeader("Content-Disposition", "attachment; filename=tools.csv");
		res.send(csv);
	} catch (error) {
		req.logger.error({
			message: "Failed to export tools",
			error: error.message,
		});
		res.status(500).send("Export failed");
	}
};

// src\controllers\settings\export.js
