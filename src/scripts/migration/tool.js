import { Tool } from "../../models/index.models.js";
import mongoose from "mongoose";

const migrateTools = async (tenant) => {
    const oldTools = await Tool.find({})
    await mongoose.connection.collection('tools').rename('tools_old');
    const toolHistories = await mongoose.connection.collection('toolhistories').find().toArray()
	for (const tool of oldTools) {
        const toolHistory = toolHistories.find(h => h._id.toString() === tool._id.toString());
		tool.history = toolHistory.history || [];
        tool.tenant = tenant;
	}
	await Tool.insertMany(oldTools);
	console.log("Tools migrated successfully.");
};

export default migrateTools;
// src\scripts\migration\tool.js
