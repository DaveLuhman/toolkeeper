import { connect, disconnect } from "mongoose";
import {
	Tenant,
	Category,
	ServiceAssignment,
	User,
} from "../../models/index.models.js";
import connectDB, { closeDbConnection } from "../../config/db.js";

jest.mock("mongoose");
jest.mock("../../models/index.models.js");

describe("closeDbConnection", () => {
	it("should expose a function", () => {
		expect(closeDbConnection).toBeDefined();
	});

	it("closeDbConnection should return expected output", () => {
		const retValue = closeDbConnection();
		expect(retValue).toBeTruthy();
	});
});
describe("connectDB", () => {
	it("should expose a function", () => {
		expect(connectDB).toBeDefined();
	});

	it("connectDB should return expected output", async () => {
		const retValue = await connectDB();
		expect(retValue).toBeTruthy();
	});
});
