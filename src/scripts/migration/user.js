import { User } from "../../models/index.models.js";

const migrateUsers = async (tenantId) => {
	const users = await User.find()
	for (const user of users) {
		user.tenant = tenantId;
		await user.save();
	}
	console.log("Users migrated successfully.");
};

export default migrateUsers;
// src\scripts\migration\user.js
