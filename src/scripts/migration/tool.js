import mongoose from "mongoose";
import { Tool } from "../../models/index.models.js";

const migrateTools = async (tenant) => {
	const allTools = await Tool.find({});
	const toolHistories = await mongoose.connection
		.collection("toolhistories")
		.find()
		.toArray();
	try {
		for (const tool of allTools) {
			const toolHistory = toolHistories.find(
				(h) => h._id.toString() === tool._id.toString(),
			);
			tool.history = toolHistory?.history || [];
			tool.tenant = tenant;
			await tool.save();
		}
	} catch (error) {
		console.log(error);
	}
	console.log("Tools migrated successfully.");
};

export default migrateTools;
// src\scripts\migration\tool.js
