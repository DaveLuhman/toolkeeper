import { connect, disconnect } from "mongoose";
import { Tenant, Category, ServiceAssignment, User } from "../models/index.models.js";

let globalConn;

async function checkUserCountAndCreateDocuments() {
	const userCount = await User.countDocuments();
	if (userCount === 0) {
		console.log(
			"No users exist in the currently selected database. Creating default user, tenant, and documents",
		);
		await createDefaultGlobalDocuments();
		await createDefaultDocuments();
	}
}

async function connectDB() {
	let retries = 3;
	while (retries > 0) {
		try {
			globalConn = await connect(process.env.MONGO_URI, {
				// Adding a timeout of 30 seconds
				serverSelectionTimeoutMS: 30000,
			});
			console.info(
				`[DB INIT] MongoDB Connected: ${globalConn.connection.host}`.cyan
					.underline.bold,
			);
			break; // Connection successful, exit retry loop
		} catch (err) {
			console.error(`DB INIT ERROR: ${err}`);
			retries--;
			if (retries === 0) {
				console.error(
					"Failed to connect to the database after multiple attempts. Exiting.",
				);
				throw new Error("Connection failed");
			}
			console.warn(`Retrying database connection. Retries left: ${retries}`);
		}
	}
	await checkUserCountAndCreateDocuments();
	return 0
}

async function createDefaultUser() {
	const usersToCreate = [
		{
			_id: "663870c0a1a9cdb4b707c737",
			firstName: "Admin",
			lastName: "User",
			password: "asdfasdf",
			role: "Superadmin",
			email: "admin@toolkeeper.site",
			tenant: "66af881237c17b64394a4166",
		},
		{
			_id: "663870c0a1a9cdb4b707c738",
			firstName: "Demo",
			lastName: "User",
			password: "demo",
			role: "Manager",
			email: "demo@toolkeeper.site",
			tenant: "66af881237c17b64394a4166",
		}]
	try {
		const createdUsers = await User.create(usersToCreate);
		return createdUsers;
	} catch (error) {
		console.error(`Error creating default user: ${error.message}`);
		throw new Error(`Failed to create default user: ${error.message}`);
	}
}

async function createDefaultTenant() {
	try {
		const tenant = await Tenant.create({
			_id: "66af881237c17b64394a4166",
			name: "demo",
			domain: "toolkeeper.site",
			adminUser: "663870c0a1a9cdb4b707c737",
		});
		return tenant;
	} catch (error) {
		console.error(error);
		throw error;
	}
}
/**
 * Creates and returns a default category object for uncategorized tools.
 * @returns {Object} The newly created category object with preset values.
 */
function createDefaultCategory() {
	return Category.create({
		_id: "64a1c3d8d71e121dfd39b7ab",
		prefix: "UC",
		name: "Uncategorized",
		description: "For Tools that dont have a category",
		tenant: "66af881237c17b64394a4166",
	});
}

/**
 * Asynchronously creates default service assignments used across the platform.
 * This function seeds the database with predefined service assignment records.
 * @returns {Promise} A promise that resolves when the service assignments are successfully created.
 */
async function createDefaultServiceAssignments() {
	const serviceAssignments = await ServiceAssignment.create([
		{
			_id: "64a19e910e675938ebb67de7",
			jobNumber: "IMPORT",
			jobName: "Imported",
			type: "Imported - Uncategorized",
			phone: "",
			notes: "Default SA for imported tools",
			active: true,
			tenant: "66af881237c17b64394a4166",
		},
		{
			_id: "64a34b651288871770df1086",
			jobNumber: "DEPOT",
			jobName: "Default stockroom for serialized tools",
			type: "Stockroom",
			active: true,
			tenant: "66af881237c17b64394a4166",
		},
		{
			_id: "64a34b651288871770df1087",
			jobNumber: "PARTS",
			jobName: "Default stockroom for consumables/parts",
			type: "Stockroom",
			active: true,
			tenant: "66af881237c17b64394a4166",
		},
	]).catch((error) => {
		console.log(error.message);
	});
	return serviceAssignments;
}

function createDefaultDocuments() {
	const defaultPromises = [
		createDefaultCategory(),
		createDefaultServiceAssignments(),
	];
	return Promise.allSettled(defaultPromises);
}

async function createDefaultGlobalDocuments() {
	const defaultGlobalPromises = [createDefaultUser(), createDefaultTenant()];
	return Promise.allSettled(defaultGlobalPromises);
}

export const closeDbConnection = () => {
	disconnect()
	return 0
}

export const demoTenantId = "66af881237c17b64394a4166";
export const DEFAULT_USER_IDS=["663870c0a1a9cdb4b707c737"]
export const DEFAULT_CATEGORY_IDS=["64a1c3d8d71e121dfd39b7ab"]
export const DEFAULT_ASSIGNMENT_IDS=["64a19e910e675938ebb67de7", "64a34b651288871770df1086", "64a34b651288871770df1087"]
export default connectDB


// src\config\db.js
