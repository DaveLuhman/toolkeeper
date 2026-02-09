// skipcq: JS-0257
import moment from "moment";
import { getCategoryName } from "../middleware/category.js";
import { getServiceAssignmentJobNumber } from "../middleware/serviceAssignment.js";
import { organizeContext } from "./context.js";
import process from "node:process";
/**
 *
 * @param {array} data
 * @param {number} targetPage
 * @param {number} perPage
 * @returns {object} trimmedData, targetPage, pageCount
 */
function paginate(data, targetPage, perPage) {
	const pp = perPage || 10;
	const tp = targetPage || 1;
	const pageCount = Math.ceil(data.length / pp); // number of pages
	const trimmedData = data.slice(pp * tp - pp, pp * tp + 1);
	return { trimmedData, tp, pageCount };
}
/**
 *
 * @param {string} option option in the list
 * @param {string} objectProperty property on the object you want checked
 * @returns
 */
function isSelected(option, objectProperty) {
	if (option === objectProperty) {
   return "selected";
 }
	return null;
}
/**
 * Retrieves the current package version from the environment variables.
 * @returns {string} The current package version.
 */
function getPackageVersion() {
	return process.env.npm_package_version;
}
/**
 * Checks if the search parameter is expected to return only one tool.
 *
 * @param {string} searchBy - The search parameter.
 * @returns {boolean} - True if the search parameter is expected to return only one tool, false otherwise.
 */
function searchingForOneTool(searchBy) {
	const searchesReturningOneTool = [
		"serialNumber",
		"barcode",
		"status",
		"modelNumber",
		"toolID",
	];
	return searchesReturningOneTool.includes(searchBy);
}

/**
 * Generates a unique identifier for a given tool document
 * @param {object} toolDocument - The document containing tool information
 * @returns An unique identifier based on the tool's ID, barcode, or serial number
 */
export const returnUniqueIdentifier = (toolDocument) => {
	try {
		const { toolID, barcode, serialNumber } = toolDocument;
		if (toolID) {
			return `Tool ID ${toolID}`;
		}
		if (barcode) {
			return `Barcode: ${barcode}`;
		}
		if (serialNumber) {
			return `SN: ${serialNumber}`;
		}
		return "Unable to uniquely identify this tool"; // Added return statement
	} catch {
		return "Unable to uniquely identify this tool";
	}
};

/**
 * Calculates the distance from today for a given date.
 * @param {Date} date - The date to calculate the distance from today.
 * @returns {string} - The distance from today in human-readable format.
 */
const hbsDate_distanceFromToday = (date) => {
	return moment(date).fromNow();
};
const generateSubscriptionUrl = (subscriptionId) => {
	return `https://app.lemonsqueezy.com/subscriptions/${subscriptionId}`;
};

const customHelpers = {
	organizeContext,
	isSelected,
	getCategoryName,
	getServiceAssignmentJobNumber,
	paginate,
	returnUniqueIdentifier,
	getPackageVersion,
	searchingForOneTool,
	hbsDate_distanceFromToday,
	generateSubscriptionUrl,
	eq: function (left, right, options) {
		if (options?.fn) {
			return left === right ? options.fn(this) : options.inverse(this);
		}
		return left === right;
	},
	gt: function (left, right, options) {
		if (options?.fn) {
			return left > right ? options.fn(this) : options.inverse(this);
		}
		return left > right;
	},
	length: (value) => {
		if (Array.isArray(value) || typeof value === "string") {
			return value.length;
		}
		if (value && typeof value === "object") {
			return Object.keys(value).length;
		}
		return 0;
	},
	contains: function (collection, value, options) {
		let result = false;
		if (typeof collection === "string") {
			const items = collection.split(",").map((item) => item.trim());
			result = items.includes(value);
		} else if (Array.isArray(collection)) {
			result = collection.includes(value);
		}
		if (options?.fn) {
			return result ? options.fn(this) : options.inverse(this);
		}
		return result;
	},
	inArray: function (value, list, options) {
		const items =
			typeof list === "string"
				? list.split(",").map((item) => item.trim())
				: Array.isArray(list)
					? list
					: [];
		const result = items.includes(value);
		if (options?.fn) {
			return result ? options.fn(this) : options.inverse(this);
		}
		return result;
	},
	withGroup: function (items, groupSize, options) {
		if (!Array.isArray(items) || !groupSize) {
			return options.inverse(this);
		}
		let output = "";
		for (let index = 0; index < items.length; index += groupSize) {
			output += options.fn(items.slice(index, index + groupSize));
		}
		return output;
	},
	moment: (date, options) => {
		const format = options?.hash?.format || "MM/DD/YYYY";
		return moment(date).format(format);
	},
	isnt: function (left, right, options) {
		if (options?.fn) {
			return left !== right ? options.fn(this) : options.inverse(this);
		}
		return left !== right;
	},
	stringify: (value) => {
		try {
			return JSON.stringify(value, null, 2);
		} catch {
			return "null";
		}
	},
	forEach: (context, options) => {
		if (!context || !options?.fn) {
			return "";
		}
		let output = "";
		if (Array.isArray(context)) {
			for (let i = 0; i < context.length; i++) {
				output += options.fn(context[i], { data: { index: i, key: i } });
			}
		} else if (typeof context === "object") {
			const keys = Object.keys(context);
			for (let i = 0; i < keys.length; i++) {
				output += options.fn(
					{ key: keys[i], content: context[keys[i]] },
					{ data: { index: i, key: keys[i] } },
				);
			}
		}
		return output;
	},
	JSONstringify: (value) => {
		try {
			return JSON.stringify(value);
		} catch {
			return "null";
		}
	},
};

export default customHelpers;
// src\helpers\index.js
