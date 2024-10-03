import passport from "passport";
import { User } from "../../models/index.models.js";
import { Strategy as LocalStrategy } from "passport-local";
import { compare } from "bcrypt";
import passportConfig from "../../config/passport.js";
import { app } from "../../server.js";

jest.mock("passport");
jest.mock("../../models/index.models.js");
jest.mock("passport-local");
jest.mock("bcrypt");

describe("passportConfig", () => {
	it("should expose a function", () => {
		expect(passportConfig).toBeDefined();
	});

	it("passportConfig should return expected output", () => {
		const retValue = passportConfig(app);
		expect(retValue).toBeTruthy();
	});
});
