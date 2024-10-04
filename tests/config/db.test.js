import { closeDbConnection } from "../../src/config/db.js";
import { config } from "dotenv";
import { Tenant } from "../../src/models/index.models.js";
import mongoose from "mongoose";
jest.mock("mongoose");
jest.mock("../../src/models/index.models.js");
jest.mock("../../src/models/index.models.js", () => ({
	Tenant: {
		createWithDefaults: jest.fn().mockResolvedValue({
			_id: "mockedTenantId",
			name: "Mocked Tenant",
		}),
	},
}));
describe("closeDbConnection",  () => {
	beforeAll(async () => {
		await mongoose.connect(process.env.MONGODB_URI)
		Tenant.createWithDefaults = jest.fn().mockResolvedValue({
			_id: "mockedTenantId",
			name: "Mocked Tenant",
		});
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(async () => {
		const conn = mongoose.connection;

		if (conn) {
            await conn.close();
        }
	});
	it("should expose a function", () => {
		expect(closeDbConnection).toBeDefined();
	});

	it("closeDbConnection should return expected output", () => {
		const retValue = closeDbConnection();
		expect(retValue).toBe(0);
	});
});
