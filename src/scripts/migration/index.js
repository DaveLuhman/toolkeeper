import migrateTools from "./tool.js";
import migrateServiceAssignments from "./serviceAssignment.js";
import migrateCategory from "./category.js";
import migrateUsers from "./user.js";
import { connect, disconnect } from "mongoose";
import { createTenantAndSubscription } from "./tenantAndSubscription.js";

async function migrateAllCollections() {

		const db = await connect('mongodb://10.10.10.9:27017/toolkeeperMigration', {
			// Adding a timeout of 30 seconds
			serverSelectionTimeoutMS: 30000,
		});
		const tenantId = await createTenantAndSubscription();
		// await migrateTools(tenantId);
		// await migrateServiceAssignments(tenantId);
		await migrateCategory(tenantId);
        await migrateUsers(tenantId);

		// Always disconnect after the migration
		disconnect();
		console.log("All collections migrated successfully.");

		disconnect();

}
migrateAllCollections()
// src\scripts\migration\index.js
