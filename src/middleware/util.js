import rateLimit from "express-rate-limit";
import { listCategoryNames } from "./category.js";
import { listActiveSAs } from "./serviceAssignment.js";
import xss from "xss";
import crypto from "node:crypto";
import { Category, ServiceAssignment, Tool } from "../models/index.models.js";

// mutate to array
/**
 * @param {any} data input data, typically before being rendered by handlebars
 * @returns {array}
 * This function will mutate the data to an array if it's not already one, but won't nest an existing array
 */
export function mutateToArray(data) {
	if (!Array.isArray(data)) {
		return [data];
	}
	return data;
}

/**
 * Sorts an array of objects based on a user-defined preference.
 * @param {Array} data - The array of objects to sort.
 * @param {string} sortField - The field within the objects to sort by.
 * @param {string} sortOrder - The order to sort by ('asc' for ascending, 'desc' for descending).
 * @returns {Array} The sorted array.
 */
export function sortByUserPreference(data, sortField, sortOrder) {
	if (sortOrder === "asc") {
		data.sort((a, b) => a[sortField] - b[sortField]);
	} else {
		data.sort((a, b) => b[sortField] - a[sortField]);
	}
	return data;
}

/**
 * @param {string} string
 * @returns {string} sanitized data
 * This function will sanitize user input to prevent XSS attacks
 * It will only allow alphanumeric characters and spaces
 **/
function sanitize(string) {
	return xss(string);
}

/**
 * @param {object} req.body
 * @param {*} res
 * @param {*} next
 * @returns {object} sanitized req.body
 * This function will sanitize the request body
 * It will only allow alphanumeric characters and - @ . (required for emails)
 **/
export function sanitizeReqBody(req, _res, next) {
	for (const key in req.body) {
		if (Object.prototype.hasOwnProperty.call(req.body, key)) {
			req.body[key] = sanitize(req.body[key]);
		}
	}
	return next();
}

export const populateDropdownItems = [listCategoryNames, listActiveSAs];

export const rateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export const createAccountLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour
	max: 5, // Limit each IP to 5 create account requests per `window` (here, per hour)
	message:
		"Too many accounts created from this IP, please try again after an hour",
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Converts a CSV file to an array of entries.
 *
 * @param {Object} file - The CSV file object.
 * @returns {Array<Array<string>>} - The array of entries.
 */
export function csvFileToEntries(file) {
	return Buffer.from(file.data)
		.toString("ascii")
		.replace("'", "")
		.replaceAll('"', "")
		.split(/\r?\n/)
		.map((row) => row.split(","));
}

/**
 * Transfers search parameters from the query string to the request body.
 * @param req The request object, containing the incoming request data and parameters.
 * @param _res The response object. Unused in this function, but required for middleware signature.
 * @param next The next middleware function in the stack.
 */
export function hoistSearchParamsToBody(req, _res, next) {
	if (req.body.searchBy === undefined) {
		const { searchBy, searchTerm } = req.query;
		req.body.searchBy = searchBy;
		req.body.searchTerm = searchTerm;
	}
	next();
}

/**
 * Deduplicates an array by removing duplicate elements.
 *
 * @param {Array} arr - The array to deduplicate.
 * @returns {Array} - The deduplicated array.
 */
export function deduplicateArray(arr) {
	return Array.from(new Set(arr)).filter((item) => item !== "");
}

// Custom error class
export class AppError extends Error {
	constructor(message, statusCode) {
		super(message);
		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
		this.isOperational = true;

		Error.captureStackTrace(this, this.constructor);
	}
}

// Centralized error handling middleware
export const errorHandler = (err, _req, res, _next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || "error";

	if (err.statusCode === 404) {
		res.status(err.statusCode).render("error/404", {
			errorCode: err.statusCode,
			errorMessage: err.message,
			errorStack: err.stack,
		});
	} else {
		res.status(err.statusCode).render("error/error", {
			errorCode: err.statusCode,
			errorMessage: err.message,
			errorStack: err.stack,
		});
	}
};

// Function to hash a JSON object
function generateHash(data) {
	return crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex");
}

// Middleware to fetch and hash datasets, and send them to the client for caching
export const initCachedContent = async (req, res, next) => {
	try {
		// Fetch service assignments and categories
		const serviceAssignments = await ServiceAssignment.find({
			tenant: req.user.tenant,
		}).lean();
		const categories = await Category.find({ tenant: req.user.tenant.valueOf() }).lean();
    await Promise.all(
      serviceAssignments.map(async (assignment) => {
        // Pre-compute toolCount for each assignment
        assignment.toolCount = await Tool.countDocuments({ serviceAssignment: assignment._id, tenant: req.user.tenant.valueOf() });
      })
    );

		const data = {
			serviceAssignments,
			categories,
		};

		// Generate a hash for the data
		const hash = generateHash(data);

		// Attach the data and hash to the response object, to be sent to the client
		res.locals.cachedContent = { data, hash };

		// Proceed to the next middleware (e.g., dashboard rendering)
		next();
	} catch (error) {
		console.error("Error fetching cached content:", error);
		res.status(500).json({ error: "Failed to fetch cached content" });
	}
};

export const rawBodySaver =  (req, _res, buf, encoding) => {
	if (buf && buf.length) {
	  req.rawBody = buf.toString(encoding || 'utf8');
	}
  }