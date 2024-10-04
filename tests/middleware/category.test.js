// test/middleware/getCategories.test.js
import { Category } from "../../src/models/index.models.js";
import { getCategories } from "../../src/middleware/category.js"; // Import the middleware function

jest.mock("../../src/models/index.models", () => ({
  Category: {
    find: jest.fn(),
  },
}));

describe("category testing", () => {
    it("should return an error when the database connection fails", async () => {
      // Arrange
      Category.find.mockReturnValue({
        sort: jest.fn().mockRejectedValue(new Error("Database connection failed"))
      });

      const req = {
        user: { tenant: { valueOf: () => "test-tenant-id" } },
        logger: { error: jest.fn() },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      // Act
      await getCategories(req, res, next);

      // Assert
      expect(req.logger.error).toHaveBeenCalledWith({
        message: "Failed to fetch categories",
        metadata: { tenantId: "test-tenant-id" },
        error: "Database connection failed",
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Database connection failed",
      });
      expect(next).not.toHaveBeenCalled();
    });
});
