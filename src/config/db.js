import { connect, disconnect } from "mongoose";
import {
	Tenant,
	Category,
	ServiceAssignment,
	User,
	Onboarding,
	Subscription,
} from "../models/index.models.js";
import process from "node:process";

let globalConn;

const checkUserCountAndCreateDocuments = async () => {
	const userCount = await User.countDocuments();
	if (userCount === 0) {
		console.log(
			"No users exist in the currently selected database. Creating default user, tenant, and documents",
		);
		await createDefaultGlobalDocuments();
		await createDefaultDocuments();
	}
};

const connectDB = async () => {
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
	return 0;
};

const createDefaultUser = async () => {
	const usersToCreate = [
		{
			_id: "663870c0a1a9cdb4b707c737",
			name: "Admin User",
			password: "asdfasdf",
			role: "Superadmin",
			email: "admin@toolkeeper.site",
			tenant: "66af881237c17b64394a4166",
		},
		{
			_id: "663870c0a1a9cdb4b707c738",
			name: "Demo User",
			password: "demo",
			role: "Manager",
			email: "demo@toolkeeper.site",
			tenant: "66af881237c17b64394a4166",
		},
	];
	try {
		return await User.create(usersToCreate);
	} catch (error) {
		console.error(`Error creating default user: ${error.message}`);
		throw new Error(`Failed to create default user: ${error.message}`);
	}
};

const createDefaultOnboardings = async () => {
	try {
		const adminAndDemoOnboardings = [
			{
				// admin onboarding document - fully completed
				user: "663870c0a1a9cdb4b707c737",
				tenant: "66af881237c17b64394a4166",
				steps: {
					profileSetup: true,
					categoryCreated: true,
					serviceAssignmentCreated: true,
					firstToolAdded: true,
					csvImportViewed: true,
				},
				progress: {
					currentStep: "complete",
					completedAt: new Date(),
				},
			},
			{
				// demo onboarding document - initial state
				user: "663870c0a1a9cdb4b707c738",
				tenant: "66af881237c17b64394a4166",
				// steps will use schema defaults (all false)
				// progress will use schema defaults (currentStep: 'profile', completedAt: null)
			},
		];
		return await Onboarding.create(adminAndDemoOnboardings);
	} catch (error) {
		console.error(`Error creating default onboarding: ${error.message}`);
		throw new Error(`Failed to create default onboarding: ${error.message}`);
	}
};

const createDefaultSubscription = async () => {
	try {
		return await Subscription.create({
			_id: "66af881237c17b64394a4167",
			user: "663870c0a1a9cdb4b707c737",
			tenant: "66af881237c17b64394a4166",
			lemonSqueezyId: "manual-entry",
			lemonSqueezyObject: {
				productName: "Toolkeeper",
				variantName: "Enterprise - Annual Billing",
				userName: "Admin User",
				userEmail: "admin@toolkeeper.site",
				status: "active",
				statusFormatted: "Active",
				cardBrand: "Visa",
				cardLastFour: "1234",
				cancelled: false,
				trialEndsAt: null,
				billingAnchor: 8,
				firstSubscriptionItem: {
					id: 617174,
					subscription_id: 810572,
					price_id: 830303,
					quantity: 1,
					is_usage_based: false,
					created_at: "2024-12-08T17:22:26.000000Z",
					updated_at: "2024-12-08T17:22:26.000000Z",
				},
				testMode: true,
			},
		});
	} catch (error) {
		console.error(`Error creating default subscription: ${error.message}`);
		throw new Error(`Failed to create default subscription: ${error.message}`);
	}
};

const createDefaultTenant = async () => {
	try {
		return await Tenant.create({
			_id: "66af881237c17b64394a4166",
			name: "demo",
			domain: "toolkeeper.site",
			adminUser: "663870c0a1a9cdb4b707c737",
			subscription: "66af881237c17b64394a4167",
		});
	} catch (error) {
		console.error(error);
		throw error;
	}
};

/**
 * Creates and returns a default category object for uncategorized tools.
 * @returns {Object} The newly created category object with preset values.
 */
const createDefaultCategory = () => {
	return Category.create({
		_id: "64a1c3d8d71e121dfd39b7ab",
		prefix: "UC",
		name: "Uncategorized",
		description: "For Tools that dont have a category",
		tenant: "66af881237c17b64394a4166",
	});
};

/**
 * Asynchronously creates default service assignments used across the platform.
 * This function seeds the database with predefined service assignment records.
 * @returns {Promise} A promise that resolves when the service assignments are successfully created.
 */
const createDefaultServiceAssignments = async () => {
	return await ServiceAssignment.create([
		{
			_id: "64a19e910e675938ebb67de7",
			jobNumber: "IMPORT",
			jobName: "Imported",
			type: "Imported - Uncategorized",
			toolCount: 0,
			phone: "",
			notes: "Default SA for imported tools",
			active: true,
			tenant: "66af881237c17b64394a4166",
		},
		{
			_id: "64a34b651288871770df1086",
			jobNumber: "DEPOT",
			jobName: "Default stockroom for serialized tools",
			toolCount: 0,
			type: "Stockroom",
			active: true,
			tenant: "66af881237c17b64394a4166",
		},
		{
			_id: "64a34b651288871770df1087",
			jobNumber: "PARTS",
			toolCount: 0,
			jobName: "Default stockroom for consumables/parts",
			type: "Stockroom",
			active: true,
			tenant: "66af881237c17b64394a4166",
		},
	]).catch((error) => {
		console.log(error.message);
	});
};

const createDefaultDocuments = () => {
	const defaultPromises = [
		createDefaultCategory(),
		createDefaultServiceAssignments(),
	];
	return Promise.allSettled(defaultPromises);
};

const createDefaultGlobalDocuments = async () => {
	const defaultGlobalPromises = [
		createDefaultUser(),
		createDefaultTenant(),
		createDefaultOnboardings(),
		createDefaultSubscription(),
	];
	return Promise.allSettled(defaultGlobalPromises);
};

export const closeDbConnection = () => {
	disconnect();
	return 0;
};

export const demoTenantId = "66af881237c17b64394a4166";
export const DEFAULT_USER_IDS = ["663870c0a1a9cdb4b707c737"];
export const DEFAULT_CATEGORY_IDS = ["64a1c3d8d71e121dfd39b7ab"];
export const DEFAULT_ASSIGNMENT_IDS = [
	"64a19e910e675938ebb67de7",
	"64a34b651288871770df1086",
	"64a34b651288871770df1087",
];
export default connectDB;

// src\config\db.js
