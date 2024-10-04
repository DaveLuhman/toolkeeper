import { renderLandingPage } from "../../src/controllers/index.js";
import request from "supertest";
import app from "../../src/server.js"; // Adjust the path to where your Express app is located
import dotenv from 'dotenv';

// Load environment variables from .env file before running tests
dotenv.config();
describe("GET / (Index Route)", () => {
	it("should respond with status code 200 and render the index page", async () => {
		const res = await request(app).get("/");
		expect(res.statusCode).toEqual(200);
		expect(res.text).toContain('<div class="hidden" id="get_index_route">'); // Replace with content on your index page
	});

	it("should respond with content-type text/html", async () => {
		const res = await request(app).get("/");
		expect(res.headers["content-type"]).toMatch(/html/);
	});
});

it("should correctly handle an empty request body and return a default response", () => {
	const req = {};
	const res = {
		render: jest.fn(),
	};

	renderLandingPage(req, res);

	expect(res.render).toHaveBeenCalledWith("index", { layout: "public.hbs" });
});

it("should return a 200 status code when the landing page is rendered successfully", () => {
	const req = {};
	const res = {
		render: jest.fn(),
		status: jest.fn().mockReturnThis(),
	};

	renderLandingPage(req, res);

	expect(res.status).toHaveBeenCalledWith(200);
	expect(res.render).toHaveBeenCalledWith("index", { layout: "public.hbs" });
});
