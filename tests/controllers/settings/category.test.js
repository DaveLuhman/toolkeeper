import { describe, it, expect, beforeEach } from "vitest";
import supertest from "supertest";
import express from "express";
import { categoryRouter } from "../../../src/routes/settings/category.routes.js"; // Adjust to your project structure
import {
	renderSettingsCategories,
	renderSettingsEditCategory,
} from "../../../src/controllers/settings/category.js";
import { demoTenantId } from "../../../src/config/db.js";
// Setup an Express app for testing
const app = express();
app.use(express.json()); // Middleware to parse JSON requests
app.use("/settings/categories", categoryRouter);

describe("Category Controller and Routes", () => {
	// Test case 1: Render Settings Categories page
	it("should render the settings categories page", async () => {
		const response = await supertest(app).get("/settings/categories");
		expect(response.status).toBe(200);
		expect(response.text).toContain("<html>"); // Assuming this route renders an HTML page
	});

	// Test case 2: Render Edit Category page
	it("should render the edit category page", async () => {
		const response = await supertest(app).get(
			"/settings/categories/edit/12345",
		);
		expect(response.status).toBe(200);
		expect(response.text).toContain("<html>"); // Assuming this route renders an HTML page
	});

	// Test case 3: Create a new category
	it("should create a new category", async () => {
		const response = await supertest(app)
			.post("/settings/categories/create")
			.send("name=Test Category");
		expect(response.status).toBe(200); // Assuming successful creation leads to a 200 response
		// Add further assertions based on the structure of the response or page content
	});

	// Test case 4: Update a category
	it("should update an existing category", async () => {
		const response = await supertest(app)
			.post("/settings/categories/edit/64a1c3d8d71e121dfd39b7ab")
			// .send("_id=12345")
			.send("name=Updated Category Name");

		expect(response.status).toBe(200); // Assuming successful update leads to a 200 response
	});

	// Test case 5: Delete a category
	it("should delete a category", async () => {
		const response = await supertest(app).get(
			"/settings/categories/delete/64a1c3d8d71e121dfd39b7ab",
		);

		expect(response.status).toBe(200); // Assuming successful deletion leads to a 200 response
		// Add further assertions based on response content
	});
});
