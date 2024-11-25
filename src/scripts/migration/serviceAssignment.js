import { ServiceAssignment } from "../../models/index.models.js";
import mongoose from "mongoose";

const migrateServiceAssignments = async (tenant) => {
	console.log("Migrating Service Assignments...");
	const allServiceAssignments = await ServiceAssignment.find({});
	try {
		for (const assignment of allServiceAssignments) {
			if (assignment.tenant === undefined) assignment.tenant = tenant;
			await assignment.save();
		}
	} catch (err) {
		console.error(err);
	}
	console.log("ServiceAssignments migrated successfully.");
};

export default migrateServiceAssignments;
// src\scripts\migration\serviceAssignment.js
