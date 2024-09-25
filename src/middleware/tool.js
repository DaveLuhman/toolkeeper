// skipcq: JS-0257
import moment from "moment";
import {
	ToolHistory,
	Tool,
	ServiceAssignment,
} from "../models/index.models.js";
import { deduplicateArray, mutateToArray } from "./util.js";
import { returnUniqueIdentifier } from "../helpers/index.js";
import sortArray from "sort-array";
import { findServiceAssignmentByJobNumber } from "./serviceAssignment.js";

/**
 * @name getAllTools
 * @returns {array}
 * @description This function will return all tools in the database along with pagination data
 */
async function getAllTools(req, res, next) {
	const { sortField, sortOrder } = req.user.preferences;
	const tenantId = req.user.tenant.valueOf();
	try {
		// Fetch tools for the tenant, sorted by user preferences
		const tools = await Tool.find({ tenant: tenantId }).sort({
			[sortField]: sortOrder || 1,
		});

		// Pass tools to the next middleware
		res.locals.tools = tools;
		return next();
	} catch (err) {
		// Log error
		req.logger.error({
			message: "Failed to fetch tools",
			metadata: {
				tenantId,
				userId: req.user._id,
				sortField,
				sortOrder,
			},
			error: err.message,
		});
		return next(err);
	}
}

/**
 * Middleware to get all active tools in the database for the current tenant.
 *
 * @param {object} req - Express request object containing user preferences and tenant information
 * @param {object} res - Express response object with `res.locals.tools` containing an array of active tools
 * @param {function} next - Express `next` function to pass control to the next middleware
 * @returns {Promise<void>} - Returns nothing directly; passes filtered tools to the next middleware
 *
 * This function fetches tools that are not archived and belong to the current tenant,
 * sorts them by the user's preferences, and filters out inactive service assignments.
 */
async function getActiveTools(req, res, next) {
	const { sortField, sortOrder } = req.user.preferences;
	const tenantId = req.user.tenant.valueOf();

	try {
		// Fetch tools that are not archived and belong to the current tenant
		const tools = await Tool.find()
			.where("archived")
			.equals(false)
			.where("tenant")
			.equals(tenantId)
			.sort({ [sortField]: sortOrder || 1 });

		// Filter tools with active service assignments
		res.locals.tools = tools.filter((tool) => tool.serviceAssignment?.active);

		// Pass control to the next middleware
		return next();
	} catch (err) {
		// Log error and pass it to the next middleware
		req.logger.error({
			message: "Failed to fetch active tools",
			metadata: {
				tenantId,
				userId: req.user._id,
				sortField,
				sortOrder,
			},
			error: err.message,
		});

		return next(err); // Pass the error to the error handling middleware
	}
}

/**
 * Middleware to get a tool by its ID and return it in the response.
 *
 * @param {object} req - Express request object containing the tool ID in `req.params.id`
 * @param {object} res - Express response object with `res.locals.tools` containing an array of tools
 * @param {function} next - Express `next` function to pass control to the next middleware
 * @returns {Promise<void>} - Returns nothing directly; passes tool and its history (if available) to the next middleware
 *
 * This function fetches the tool by ID for the current tenant, along with its history, and returns them in the response.
 * The tool is returned in an array so that Handlebars can iterate over it.
 */
async function getToolByID(req, res, next) {
	const id = req.params.id;
	const tenantId = req.user.tenant.valueOf();

	try {
		// Log the tool search attempt
		req.logger.info(`[MW] searching for tool by ID: ${id}`);
		// Fetch the tool by ID and tenant
		const tools = await Tool.find({
			_id: { $eq: id },
			tenant: { $eq: tenantId },
		});
		// Fetch tool history by tool ID and tenant, sorted by `updatedAt`
		const toolHistory = await ToolHistory.find({
			_id: { $eq: id },
			tenant: { $eq: tenantId },
		}).sort({ updatedAt: 1 });
		// If tool not found, throw an error
		if (!tools.length) {
			throw new Error(`Tool with ID ${id} not found for tenant ${tenantId}`);
		}
		// Set the fetched tool in response locals as an array (for Handlebars)
		res.locals.tools = mutateToArray(tools);
		// Check if tool history exists, and sort it by `updatedAt` if present
		if (toolHistory.length && toolHistory[0].history) {
			res.locals.toolHistory = sortArray(toolHistory[0].history, {
				by: "updatedAt",
				order: "desc",
			});
		}
		// Pass control to the next middleware
		return next();
	} catch (err) {
		// Log the error and pass it to the error handling middleware
		req.logger.error({
			message: "Failed to fetch tool by ID",
			metadata: {
				tenantId,
				userId: req.user._id,
				toolId: id,
			},
			error: err.message,
		});
		return next(err);
	}
}

/**
 * Retrieves a list of checked-in tools for the given tenant.
 *
 * @param {string} tenantId - The ID of the tenant
 * @returns {Promise<array>} - An array of checked-in tools
 */
async function getCheckedInTools(tenantId, logger) {
	try {
		// Fetch all unarchived tools for the tenant
		const tools = await Tool.find()
			.where("archived")
			.equals(false)
			.where("tenant")
			.equals(tenantId);

		// Fetch all stockroom service assignments for the tenant
		const stockroomDocs = await ServiceAssignment.find()
			.where("type")
			.equals("Stockroom")
			.where("tenant")
			.equals(tenantId);

		// Initialize an array to hold the checked-in tools
		const checkedInTools = [];

		// Iterate through the tools and stockroom documents
		for (let i = 0; i < tools.length; i++) {
			for (let ii = 0; ii < stockroomDocs.length; ii++) {
				if (stockroomDocs[ii]?.id === tools[i].serviceAssignment?.id) {
					checkedInTools.push(tools[i]);
				}
			}
		}

		return checkedInTools;
	} catch (err) {
		// Log any errors that occur
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
 *
 * @param {string} tenantId - The ID of the tenant
 * @returns {Promise<array>} - An array of checked-out tools
 */
async function getCheckedOutTools(tenantId, logger) {
	try {
		// Fetch all unarchived tools for the tenant
		const tools = await Tool.find()
			.where("archived")
			.equals(false)
			.where("tenant")
			.equals(tenantId);
		// Fetch all active service assignments except for Stockroom
		const activeServiceAssignmentsDocs = await ServiceAssignment.find()
			.where("type")
			.ne("Stockroom")
			.where("tenant")
			.equals(tenantId);
		// Map service assignments to an array of IDs
		const activeServiceAssignmentArray = activeServiceAssignmentsDocs.map(
			(item) => item._id.valueOf(),
		);
		// Initialize an array to hold the checked-out tools
		const checkedOutTools = [];
		// Iterate through the tools and active service assignments
		for (let i = 0; i < tools.length; i++) {
			for (let ii = 0; ii < activeServiceAssignmentArray.length; ii++) {
				if (
					activeServiceAssignmentArray[ii] === tools[i].serviceAssignment?._id
				) {
					checkedOutTools.push(tools[i]);
				}
			}
		}
		return checkedOutTools;
	} catch (err) {
		// Log any errors that occur
		logger.error({
			message: "Failed to fetch checked-out tools",
			metadata: { tenantId },
			error: err.message,
		});

		throw err;
	}
}

/**
 * Middleware to search tools based on user input (serviceAssignment, category, status, or other fields).
 *
 * @param {object} req - Express request object
 * @param {string} req.body.searchBy - The key to search by
 * @param {string} req.body.searchTerm - The term to search for
 * @param {number} req.query.p - Page number
 * @param {object} res - Express response object with `res.locals.pagination` and `res.locals.tools`
 * @param {function} next - Express `next` function to pass control to the next middleware
 * @returns {Promise<void>} - Returns an array of tools based on search criteria
 */
async function searchTools(req, res, next) {
	const { sortField, sortOrder } = req.user.preferences;
	const { searchBy, searchTerm } = req.body;

	try {
		if (!searchBy || searchBy === "Search By") {
			res.locals.message = "You must specify search parameters";
			return next();
		}

		res.locals.searchBy = searchBy;
		res.locals.searchTerm = searchTerm;

		switch (searchBy) {
			case "serviceAssignment":
				res.locals.tools = await Tool.where("serviceAssignment")
					.equals(searchTerm)
					.where("tenant")
					.equals(req.user.tenant.valueOf())
					.sort({ [sortField]: sortOrder || 1 })
					.exec();
				break;

			case "category":
				res.locals.tools = await Tool.where("category")
					.equals(searchTerm)
					.where("tenant")
					.equals(req.user.tenant.valueOf())
					.sort({ [sortField]: sortOrder || 1 })
					.exec();
				break;

			case "status":
				if (searchTerm === "Checked In") {
					res.locals.tools = await getCheckedInTools(
						req.user.tenant.valueOf(),
						req.logger,
					);
				} else {
					res.locals.tools = await getCheckedOutTools(
						req.user.tenant.valueOf(),
						req.logger,
					);
				}
				break;

			default:
				res.locals.tools = await Tool.find({
					[searchBy]: { $eq: searchTerm },
					tenant: { $eq: req.user.tenant.valueOf() },
				}).sort({ [sortField]: sortOrder || 1 });
				break;
		}

		res.locals.totalFound = res.locals.tools.length;
		return next();
	} catch (err) {
		req.logger.error({
			message: "Search tools failed",
			metadata: {
				tenantId: req.user.tenant.valueOf(),
				searchBy,
				searchTerm,
			},
			error: err.message,
		});

		return next(err);
	}
}

/**
 * Middleware to create a new tool for the current tenant.
 *
 * @param {object} req - Express request object containing the tool details in `req.body`
 * @param {object} res - Express response object with `res.locals.message` containing feedback for the user
 * @param {function} next - Express `next` function to pass control to the next middleware
 * @returns {Promise<void>}
 */
async function createTool(req, res, next) {
	try {
		const {
			serialNumber,
			modelNumber,
			barcode,
			description,
			toolID,
			serviceAssignment,
			category,
			manufacturer,
			width,
			height,
			length,
			weight,
		} = req.body;

		const tenant = req.user.tenant.valueOf();

		// Validate required fields
		if (!(serialNumber || modelNumber) || !barcode) {
			throw new Error("Missing required fields");
		}

		// Check if the tool already exists
		const existing = await Tool.findOne({
			$or: [{ serialNumber }, { barcode }],
			tenant: { $eq: tenant },
		});

		if (existing) {
			res.locals.tools = mutateToArray(existing);
			throw new Error("Tool already exists");
		}

		// Create the new tool
		const newTool = await Tool.create({
			serialNumber,
			modelNumber,
			barcode,
			description,
			toolID,
			serviceAssignment,
			category,
			manufacturer,
			size: {
				height,
				width,
				length,
				weight,
			},
			updatedBy: req.user._id,
			createdBy: req.user._id,
			tenant,
		});

		if (!newTool) {
			throw new Error("Could not create tool");
		}

		// Log the creation of the tool's history
		await ToolHistory.create({
			_id: newTool._id,
			history: [newTool],
			tenant,
		});

		res.locals.message = "Successfully made a new tool";
		res.locals.tools = [newTool];
		res.locals.pagination = { pageCount: 1 };
		res.status(201);
		return next();
	} catch (error) {
		req.logger.error({
			message: "Failed to create tool",
			metadata: {
				tenantId: req.user.tenant.valueOf(),
				userId: req.user._id,
				toolDetails: req.body,
			},
			error: error.message,
		});

		res.locals.message = error.message;
		res.status(500).redirect("back");
	}
}

/**
 * Middleware to update a single tool by its ID.
 * Adds an entry to the embedded history for service assignment changes.
 *
 * @param {object} req - Express request object containing the tool data in `req.body`
 * @param {string} req.body.id - The ID of the tool to update
 * @param {object} res - Express response object with `res.locals.tools` containing the updated tool
 * @param {function} next - Express `next` function to pass control to the next middleware
 * @returns {Promise<void>}
 */
async function updateTool(req, res, next) {
	try {
		const {
			id,
			modelNumber,
			description,
			serviceAssignment,
			category,
			manufacturer,
			width,
			height,
			length,
			weight,
		} = req.body;

		// Validate the required fields
		if (!id) {
			throw new Error("Missing required fields: id");
		}

		// Find the tool by ID and update it
		const updatedTool = await Tool.findByIdAndUpdate(
			id,
			{
				modelNumber,
				description,
				serviceAssignment,
				category,
				manufacturer,
				size: {
					width,
					height,
					length,
					weight,
				},
				$inc: { __v: 1 }, // Increment version number
				updatedAt: Date.now(), // Set the updated time
			},
			{ new: true }, // Return the updated document
		);

		// If no tool was updated, throw an error
		if (!updatedTool) {
			throw new Error("Tool not found or could not be updated");
		}

		// Add a history entry to track changes
		updatedTool.history.push({
			updatedBy: req.user._id,
			serviceAssignment,
			status: updatedTool.status, // Derived from serviceAssignment
			changeDescription: `Service assignment updated to ${serviceAssignment}`,
		});

		await updatedTool.save();

		// Return the updated tool in response
		res.locals.tools = [updatedTool];
		res.status(200);
		next();
	} catch (error) {
		// Log the error
		req.logger.error({
			message: "Failed to update tool",
			metadata: {
				toolId: req.body.id,
				userId: req.user._id,
				toolDetails: req.body,
			},
			error: error.message,
		});

		res.status(500).json({ message: error.message });
	}
}

/**
 * Middleware to archive a tool by its ID.
 *
 * @param {object} req - Express request object containing the tool ID in `req.params.id`
 * @param {object} res - Express response object with `res.locals.message` and `res.locals.tools`
 * @param {function} next - Express `next` function to pass control to the next middleware
 * @returns {Promise<void>}
 */
async function archiveTool(req, res, next) {
	try {
		const { id } = req.params;

		const archivedTool = await Tool.findByIdAndUpdate(
			id,
			{ archived: true },
			{ new: true },
		);

		if (!archivedTool) {
			throw new Error(`Tool with ID ${id} not found`);
		}

		await ToolHistory.findByIdAndUpdate(
			id,
			{ $push: { history: [archivedTool] } },
			{ new: true },
		);

		res.locals.message = `Successfully Archived Tool ${archivedTool.toolID}`;
		res.locals.tools = mutateToArray(archivedTool);
		res.status(201);
		next();
	} catch (error) {
		req.logger.error({
			message: "Failed to archive tool",
			metadata: {
				toolId: req.params.id,
				userId: req.user._id,
			},
			error: error.message,
		});
		res.status(500).json({ message: error.message });
	}
}

/**
 * Middleware to unarchive a tool by its ID.
 *
 * @param {object} req - Express request object containing the tool ID in `req.params.id`
 * @param {object} res - Express response object with `res.locals.message` and `res.locals.tools`
 * @param {function} next - Express `next` function to pass control to the next middleware
 * @returns {Promise<void>}
 */
async function unarchiveTool(req, res, next) {
	try {
		const { id } = req.params;

		const unarchivedTool = await Tool.findByIdAndUpdate(
			id,
			{ archived: false },
			{ new: true },
		);

		if (!unarchivedTool) {
			throw new Error(`Tool with ID ${id} not found`);
		}

		await ToolHistory.findByIdAndUpdate(
			id,
			{ $push: { history: [unarchivedTool] } },
			{ new: true },
		);

		res.locals.message = `Successfully Restored Tool ${returnUniqueIdentifier(unarchivedTool)}`;
		res.locals.tools = mutateToArray(unarchivedTool);
		res.status(201);
		next();
	} catch (error) {
		req.logger.error({
			message: "Failed to unarchive tool",
			metadata: {
				toolId: req.params.id,
				userId: req.user._id,
			},
			error: error.message,
		});
		res.status(500).json({ message: error.message });
	}
}

/**
 * Middleware to check tools for service assignment changes.
 *
 * @param {object} req - Express request object containing search terms in `req.body.searchTerms`
 * @param {object} res - Express response object with `res.locals.message` and `res.locals.tools`
 * @param {function} next - Express `next` function to pass control to the next middleware
 * @returns {Promise<void>}
 */
async function checkTools(req, res, next) {
	try {
		if (!req.body.searchTerms) {
			res.locals.message = "No Tools Submitted For Status Change";
			res.status(400).redirect("back");
			return next();
		}

		const destinationServiceAssignment =
			req.body.serviceAssignmentInput === ""
				? req.body.serviceAssignmentSelector
				: await findServiceAssignmentByJobNumber(
						req.body.serviceAssignmentInput,
					);

		if (!destinationServiceAssignment) {
			res.locals.message =
				"No Service Assignment Found. Please select one from the dropdown";
			res.locals.displaySelector = true;
		}

		res.locals.destinationServiceAssignment = destinationServiceAssignment;

		const search = deduplicateArray(req.body.searchTerms.split(/\r?\n/));
		const toolsToBeChanged = await lookupToolWrapper(
			search,
			req.user.tenantId.valueOf(),
		);

		if (toolsToBeChanged.length === 0) {
			res.locals.message = "No Tools Found Matching ";
		}

		res.locals.tools = toolsToBeChanged;
		next();
	} catch (error) {
		req.logger.error({
			message: "Failed to check tools",
			metadata: {
				tenantId: req.user.tenantId.valueOf(),
				searchTerms: req.body.searchTerms,
			},
			error: error.message,
		});
		res.status(500).json({ message: error.message });
	}
}

/**
 * Middleware to submit check-in/out requests for tools.
 *
 * @param {object} req - Express request object containing tool IDs and service assignment
 * @param {object} res - Express response object with `res.locals.tools` and `res.locals.message`
 * @param {function} next - Express `next` function to pass control to the next middleware
 * @returns {Promise<void>}
 */
async function submitCheckInOut(req, res, next) {
	try {
		const id = mutateToArray(req.body.id);
		const { destinationServiceAssignment } = req.body;
		const newTools = [];

		for (let i = 0; i < id.length; i++) {
			if (id[i] === "toolNotFound") break;
			updateToolHistory(id[i]);
			const updatedTool = await Tool.findByIdAndUpdate(
				id[i],
				{
					serviceAssignment: destinationServiceAssignment,
					$inc: { __v: 1 },
					updatedAt: Date.now(),
				},
				{ new: true },
			);
			newTools.push(updatedTool);
		}

		res.locals.tools = newTools;
		res.locals.message = `${newTools.length} tool(s) have been updated`;
		next();
	} catch (error) {
		req.logger.error({
			message: "Failed to submit check-in/out",
			metadata: {
				toolIds: req.body.id,
				userId: req.user._id,
			},
			error: error.message,
		});
		res.status(500).json({ message: error.message });
	}
}
/**
 * Generates a printer-friendly tool list based on the provided tools.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
const generatePrinterFriendlyToolList = async (req, res, next) => {
	try {
		if (!res.locals.tools || res.locals.tools.length === 0) {
			res.locals.message = "There are no tools to make into a list";
			req.logger.info({
				message: "No tools available for printer-friendly list",
				metadata: { tenantId: req.user.tenant.valueOf() },
			});
			return next();
		}

		const { tools } = res.locals;
		const printerFriendlyToolArray = tools.map((tool) => {
			const { serialNumber, modelNumber, toolID, barcode, description } = tool;
			return { serialNumber, modelNumber, toolID, barcode, description };
		});

		if (printerFriendlyToolArray.length === 0) {
			throw new Error("There was a problem creating the printer-friendly data");
		}

		res.locals.printerFriendlyTools = printerFriendlyToolArray || [];
		req.logger.info({
			message: "Printer-friendly tool list generated",
			metadata: {
				tenantId: req.user.tenant.valueOf(),
				toolCount: printerFriendlyToolArray.length,
			},
		});

		return next();
	} catch (err) {
		req.logger.error({
			message: "Failed to generate printer-friendly tool list",
			metadata: { tenantId: req.user.tenant.valueOf() },
			error: err.message,
		});

		res.locals.message = err.message;
		res.locals.printerFriendlyTools = [];
		return next();
	}
};
/**
 * Retrieves the dashboard statistics.
 *
 * @returns {Object} - An object containing the dashboard statistics.
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
		const stockroomTools = await getCheckedInTools(tenantId);
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
 * @returns {Promise<Array>} A promise that resolves to an array of recently updated tools.
 */
async function getRecentlyUpdatedTools(tenant, logger) {
	try {
		const tools = await Tool.find({ tenant: { $eq: tenant } })
			.sort({ updatedAt: -1 })
			.limit(50);

		logger.info({
			message: "Fetched recently updated tools",
			metadata: { tenantId: tenant, toolCount: tools.length },
		});

		return tools;
	} catch (error) {
		logger.error({
			message: "Failed to fetch recently updated tools",
			metadata: { tenantId: tenant },
			error: error.message,
		});
		return [];
	}
}

export {
	getAllTools,
	getActiveTools,
	getToolByID,
	searchTools,
	createTool,
	updateTool,
	archiveTool,
	unarchiveTool,
	checkTools,
	submitCheckInOut,
	generatePrinterFriendlyToolList,
	getDashboardStats,
	getRecentlyUpdatedTools,
};

// src\middleware\tool.js
