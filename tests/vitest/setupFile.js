// setupFile.js
import { beforeEach, afterEach } from "vitest";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables based on the NODE_ENV
const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
dotenv.config({ path: envFile });
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;
// Set up MongoDB connection
beforeEach(async () => {
	try {
		mongoServer = await MongoMemoryServer.create();
		const uri = mongoServer.getUri();
		await mongoose.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("MongoDB connection established.");
	} catch (err) {
		console.error("MongoDB connection error:", err);
	}
})
// Disconnect from in-memory MongoDB after each test
afterEach(async () => {
	await mongoose.disconnect();
	await mongoServer.stop();
});
// Close the MongoDB connection after all tests are done
afterAll(async () => {
	await mongoose.disconnect();
	console.log("MongoDB connection closed.");
});
