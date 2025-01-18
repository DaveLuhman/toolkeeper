import { User, Onboarding } from "../../models/index.models.js";

const migrateUsers = async (tenantId) => {
	const users = await User.find({ tenant: null });
	try {
		for (const user of users) {
			user.tenant = tenantId;
			await user.save();
			await Onboarding.create({
				user: user._id,
			});
		}
	} catch (error) {
		console.log(error);
	}
	console.log("Users migrated and onboarding created successfully.");
};

export default migrateUsers;
// src\scripts\migration\user.js
