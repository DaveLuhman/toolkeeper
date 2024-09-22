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
 *
 * @param {*} req.body._id The id of the tool to update
 * @param {*} res
 * @param {*} next
 */
async function updateTool(req, res, next) {
	console.info("[MW] updateTool-in".bgBlue.white);

	if (!req.body.serviceAssignment) {
		req.body.serviceAssignment = "64a34b651288871770df1086";
	}
	if (!req.body.category) {
		req.body.category = "64a1c3d8d71e121dfd39b7ab";
	}
	// block level function to update a single tool
	const {
		id,
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
	const updatedTool = await Tool.findByIdAndUpdate(
		{ $eq: id },
		{
			barcode,
			modelNumber,
			description,
			toolID,
			serviceAssignment,
			category,
			manufacturer,
			size: {
				width,
				height,
				length,
				weight,
			},
			$inc: { __v: 1 },
			$set: { updatedAt: Date.now() },
		},
		{ new: true },
	);

	const updatedToolArray = [];
	// if (typeof req.body.id === 'string') {
	updateToolHistory(id); // Update the tools history
	updatedToolArray.push(updatedTool);
	// }
	// if (Array.isArray(req.body._id) && req.body._id.length > 0) {
	//   for (let i = 0; i < req.body.id.length > 100; i++) {
	//     const updatedTool = await ut({
	//       _id: req.body.id[i],
	//       modelNumber: req.body.modelNumber[i],
	//       description: req.body.description[i],
	//       toolID: req.body.toolID[i],
	//       serviceAssignment: req.body.serviceAssignment[i],
	//       category: req.body.category[i],
	//       manufacturer: req.body.manufacturer[i],
	//       size: {
	//         width: req.body.size.width[i],
	//         height: req.body.size.height[i],
	//         length: req.body.size.length[i],
	//         weight: req.body.size.weight[i]
	//       },
	//       $inc: { __v: 1 },
	//       $set: { updatedAt: Date.now() }
	//     })
	//     updatedToolArray.push(updatedTool)
	//   }
	// }
	res.locals.tools = updatedToolArray;
	res.status(200);
	console.info("[MW] Successfully Updated Tools: ".green + updatedToolArray);
	console.info("[MW] updateTool-out-1".bgWhite.blue);
	next();
}
/**
 * archiveTool - Archives a tool
 * @param {string} req.params.id The id of the tool to archive
 * @param {string} res.locals.message The message to display to the user
 * @param {array} res.locals.tools The tool that was archived
 * @param {number} res.status The status code to return
 * @param {*} next
 */
async function archiveTool(req, res, next) {
	console.info("[MW] archiveTool-in".bgBlue.white);
	const { id } = req.params;
	const archivedTool = await Tool.findByIdAndUpdate(
		{ _id: id },
		{ archived: true },
		{ new: true },
	);
	await ToolHistory.findByIdAndUpdate(
		{ _id: id },
		{ $push: { history: [archivedTool] } },
		{ new: true },
	);
	res.locals.message = `Successfully Archived Tool ${archivedTool.toolID}`;
	res.locals.tools = mutateToArray(archivedTool);
	res.status(201);
	next();
}

/**
 * unarchiveTool - Unarchives a tool
 * @param {string} req.params.id The id of the tool to unarchive
 * @param {string} res.locals.message The message to display to the user
 * @param {array} res.locals.tools The tool that was unarchived
 * @param {number} res.status The status code to return
 * @param {*} next
 */
async function unarchiveTool(req, res, next) {
	console.info("[MW] archiveTool-in".bgBlue.white);
	const { id } = req.params;
	const unarchivedTool = await Tool.findByIdAndUpdate(
		{ _id: id },
		{ archived: false },
		{ new: true },
	);
	await ToolHistory.findByIdAndUpdate(
		{ _id: id },
		{ $push: { history: [unarchivedTool] } },
		{ new: true },
	);
	res.locals.message = `Successfully Restored Tool ${returnUniqueIdentifier(
		unarchivedTool,
	)}`;
	res.locals.tools = mutateToArray(unarchivedTool);
	res.status(201);
	next();
}
/**
 * checkTools - Checks the tools
 * @param {*} req The request object
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function checkTools(req, res, next) {
	if (!req.body.searchTerms) {
		res.locals.message = "No Tools Submitted For Status Change";
		console.warn("[MW checkTools-out-1".bgWhite.blue);
		res.status(400).redirect("back");
		return next();
	}
	const destinationServiceAssignment =
		req.body.serviceAssignmentInput === ""
			? req.body.serviceAssignmentSelector
			: await findServiceAssignmentByJobNumber(req.body.serviceAssignmentInput);
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
}
/**
 *
 * @param {string} searchTerm search target
 * @param {string} searchField optional, key to search - if not provided, will search all fields
 * @returns {object}
 */
async function lookupTool(searchTerm, tenantId) {
	const capitalizedSearchTerm = searchTerm.toUpperCase();
	let result = await Tool.findOne({
		serialNumber: { $eq: capitalizedSearchTerm },
		tenant: { $eq: tenantId },
	});
	if (!result) {
		result = await Tool.findOne({
			barcode: { $eq: capitalizedSearchTerm },
			tenant: { $eq: tenantId },
		});
	}
	if (!result) {
		result = await Tool.findOne({
			toolID: { $eq: capitalizedSearchTerm },
			tenant: { $eq: tenantId },
		});
	}
	if (!result) {
		result = {};
	}
	return result;
}
/**
 * @name lookupToolWrapper
 * @desc iterator for looking up multiple search terms for checkTools
 * @param {*} searchTerms
 * @return {*} array of tools, with dummy objects if nothing is found
 */
async function lookupToolWrapper(searchTerms, tenantId) {
	const tools = [];
	for (let i = 0; i < searchTerms.length; i++) {
		const result = await lookupTool(searchTerms[i], tenantId);
		if (result?.serialNumber === undefined) {
			tools.push({
				serialNumber: searchTerms[i],
			});
		} else tools.push(result);
	}
	return tools;
}
/**
 * submitCheckInOut - Submits the check-in/out request
 * @param {*} req The request object
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
async function submitCheckInOut(req, res, next) {
	try {
		const id = mutateToArray(req.body.id);
		const { destinationServiceAssignment } = req.body;
		const newTools = [];
		for (let i = 0; i < id.length; i++) {
			if (id[i] === "toolNotFound") break;
			updateToolHistory(id[i]);
			newTools.push(
				await Tool.findByIdAndUpdate(
					{ _id: id[i] },
					{
						serviceAssignment: destinationServiceAssignment,
						$inc: { __v: 1 },
						$set: { updatedAt: Date.now() },
					},
					{ new: true },
				),
			);
		}
		res.locals.tools = newTools;
		res.locals.message = `${newTools.length} tool(s) have been updated`;
		next();
	} catch (error) {
		console.error(error.message);
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
		if (!res.locals.tools || res.locals.tools?.length === 0) {
			res.locals.message = "There are no tools to make into a list";
			return next();
		}
		const { tools } = res.locals;
		const printerFriendlyToolArray = await tools.map((tool) => {
			const { serialNumber, modelNumber, toolID, barcode, description } = tool;
			return {
				serialNumber,
				modelNumber,
				toolID,
				barcode,
				description,
			};
		});
		if (printerFriendlyToolArray?.length === 0)
			throw new Error("There was a problem creating the printer friendly data");
		res.locals.printerFriendlyTools = printerFriendlyToolArray || [];
		return next();
	} catch (err) {
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
async function getDashboardStats(tenantId) {
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
		return { todaysTools, thisWeeksTools, totalIn, totalOut, totalTools };
	} catch (error) {
		return { todaysTools: 0, thisWeeksTools: 0, totalIn: 0, totalOut: 0 };
	}
}
/**
 * Retrieves the recently updated tools.
 * @returns {Promise<Array>} A promise that resolves to an array of recently updated tools.
 */
async function getRecentlyUpdatedTools(tenant) {
	const tools = await Tool.find({ tenant: { $eq: tenant } })
		.sort({ updatedAt: -1 })
		.limit(50);
	return tools;
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
