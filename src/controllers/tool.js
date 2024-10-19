import { ServiceAssignment, Tool } from "../models/index.models.js";
import { batchImportTools } from "../middleware/import/batch.js";
import { deduplicateArray } from "../middleware/util.js";
import moment from "moment";

/**
 * Retrieves a list of checked-in tools for the given tenant.
 */
async function getCheckedInTools(tenantId, logger) {
	try {
		const tools = await Tool.find()
			.where("archived")
			.equals(false)
			.where("tenant")
			.equals(tenantId);

		const stockroomDocs = await ServiceAssignment.find()
			.where("type")
			.equals("Stockroom")
			.where("tenant")
			.equals(tenantId);

		const checkedInTools = tools.filter((tool) =>
			stockroomDocs.some((stockroomDoc) =>
				stockroomDoc.equals(tool.serviceAssignment),
			),
		);

		return checkedInTools;
	} catch (err) {
		logger.error({
			message: "Failed to fetch checked-in tools",
			metadata: { tenantId },
			error: err.message,
		});

		throw err;
	}
}

/**
 * Retrieves a list of checked-out tools for the given tenant.
 */
async function getCheckedOutTools(tenantId, logger) {
	try {
		const tools = await Tool.find()
			.where("archived")
			.equals(false)
			.where("tenant")
			.equals(tenantId);

		const activeServiceAssignments = await ServiceAssignment.find()
			.where("type")
			.ne("Stockroom")
			.where("tenant")
			.equals(tenantId)
			.select("_id");

		const checkedOutTools = tools.filter((tool) =>
			activeServiceAssignments.some((assignment) =>
				assignment._id.equals(tool.serviceAssignment),
			),
		);

		return checkedOutTools;
	} catch (err) {
		logger.error({
			message: "Failed to fetch checked-out tools",
			metadata: { tenantId },
			error: err.message,
		});

		throw err;
	}
}

/**
 * Retrieves the dashboard statistics.
 */
async function getDashboardStats(tenantId, logger) {
	const startOfDay = moment().startOf("day").toDate();
	const endOfDay = moment().endOf("day").toDate();
	const startOfWeek = moment().startOf("week").toDate();
	const endOfWeek = moment().endOf("week").toDate();

	try {
		const todaysTools = await Tool.countDocuments({
			updatedAt: { $gte: startOfDay, $lte: endOfDay },
			tenant: { $eq: tenantId },
		});
		const thisWeeksTools = await Tool.countDocuments({
			updatedAt: { $gte: startOfWeek, $lte: endOfWeek },
			tenant: { $eq: tenantId },
		});
		const totalTools = await Tool.countDocuments({ tenant: tenantId });
		const stockroomTools = await getCheckedInTools(tenantId, logger);
		const totalIn = stockroomTools.length;
		const totalOut = totalTools - totalIn;

		logger.info({
			message: "Fetched dashboard stats",
			metadata: {
				tenantId,
				todaysTools,
				thisWeeksTools,
				totalIn,
				totalOut,
				totalTools,
			},
		});

		return { todaysTools, thisWeeksTools, totalIn, totalOut, totalTools };
	} catch (error) {
		logger.error({
			message: "Failed to fetch dashboard stats",
			metadata: { tenantId },
			error: error.message,
		});
		return { todaysTools: 0, thisWeeksTools: 0, totalIn: 0, totalOut: 0 };
	}
}

/**
 * Retrieves the recently updated tools.
 */


/**
 * Renders the results page.
 * @param {object} req The request object.
 * @param {object} res The response object. Used to render the 'results' page.
 */
export const renderResults = (req, res) => {
	res.render("results");
};
/**
 * Renders the status change confirmation page.
 * @param {object} _req The request object.
 * @param {object} res The response object. Used to render the status change confirmation page.
 */
export const renderStatusChangeConfirmationPage = (_req, res) => {
	res.render("checkInOut");
};

/**
 * Renders the edit tool page.
 * @param _req The request object (not used in this function).
 * @param res The response object used to render the page.
 */
export const renderEditTool = (_req, res) => {
	res.render("editTool");
};
/**
 * Renders the edit tool page.
 * @param _req The request object (not used in this function).
 * @param res The response object used to render the page.
 */
export const renderDashboard = async (req, res) => {
	try {
		res.locals.dashboardStats = await getDashboardStats(
			req.user.tenant,
			req.logger,
		);
		res.render("dashboard", { cachedContent: res.locals.cachedContent });
	} catch (err) {
		console.error(err);
		res.render("error/error");
	}
};

/**
 * Renders the batch creation page.
 *
 * @param {Object} _req - The request object.
 * @param {Object} res - The response object.
 */
export const renderBatchCreationPage = (_req, res) => {
	res.render("batchCreate");
};

/**
 * Batch create tools.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const batchCreateTools = async (req, res) => {
	const { newTools, errorList } = await batchImportTools(req.body);
	res.locals.tools = deduplicateArray(newTools).filter(
		(tool) => tool !== undefined,
	);
	res.locals.errorList = errorList;
	res.locals.message = `${errorList.length} failed to import.`;
	res.render("results");
};
// src\controllers\tool.js
