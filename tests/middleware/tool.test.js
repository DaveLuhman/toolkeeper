import moment from "moment";
import { Tool, ServiceAssignment } from "../../src/models/index.models.js";
import { deduplicateArray, mutateToArray } from "../../src/middleware/util.js";
import { returnUniqueIdentifier } from "../../src/helpers/index.js";
import sortArray from "sort-array";
import { findServiceAssignmentByJobNumber } from "../../src/middleware/serviceAssignment.js";
import {
	getAllTools,
	getActiveTools,
	getToolByID,
	searchTools,
	createTool,
	updateTool,
	archiveTool,
	unarchiveTool,
	checkTools,
	submitCheckInOut,
	generatePrinterFriendlyToolList,
} from "../../src/middleware/tool.js";

jest.mock("moment");
jest.mock("../../src/models/index.models.js");
jest.mock("../../src/middleware/util.js");
jest.mock("../../src/helpers/index.js");
jest.mock("sort-array");
it("should handle invalid search parameters in searchTools", async () => {
	const req = {
		user: {
			preferences: { sortField: "toolID", sortOrder: 1 },
			tenant: { valueOf: () => "testTenantId" },
		},
		body: { searchBy: "Search By", searchTerm: "test" },
	};
	const res = { locals: {} };
	const next = jest.fn();

	await searchTools(req, res, next);

	expect(res.locals.message).toBe("You must specify search parameters");
	expect(next).toHaveBeenCalled();
	expect(res.locals.tools).toBeUndefined();
	expect(res.locals.totalFound).toBeUndefined();
});
it("should validate required fields when creating a new tool", async () => {
	const req = {
		body: {
			serialNumber: "",
			modelNumber: "",
			barcode: "",
		},
		user: {
			tenant: {
				valueOf: jest.fn().mockReturnValue("testTenantId"),
			},
			_id: "testUserId",
		},
		logger: {
			error: jest.fn(),
		},
	};
	const res = {
		locals: {},
		status: jest.fn().mockReturnThis(),
		redirect: jest.fn(),
	};
	const next = jest.fn();

	await createTool(req, res, next);

	expect(res.locals.message).toBe("Missing required fields");
	expect(res.status).toHaveBeenCalledWith(500);
	expect(res.redirect).toHaveBeenCalledWith("back");
	expect(req.logger.error).toHaveBeenCalledWith({
		message: "Failed to create tool",
		metadata: {
			tenantId: "testTenantId",
			userId: "testUserId",
			toolDetails: req.body,
		},
		error: "Missing required fields",
	});
});
test("Should handle duplicate tool creation attempts", async () => {
	const req = {
		body: {
			serialNumber: "SN123",
			barcode: "BC123",
			description: "Test Tool",
		},
		user: {
			tenant: {
				valueOf: () => "tenant123",
			},
			_id: "user123",
		},
		logger: {
			error: jest.fn(),
		},
	};

	const res = {
		locals: {},
		status: jest.fn().mockReturnThis(),
		redirect: jest.fn(),
	};

	const next = jest.fn();

	Tool.findOne.mockResolvedValueOnce({
		serialNumber: "SN123",
		barcode: "BC123",
	});
	mutateToArray.mockReturnValueOnce([
		{ serialNumber: "SN123", barcode: "BC123" },
	]);

	await createTool(req, res, next);

	expect(Tool.findOne).toHaveBeenCalledWith({
		$or: [{ serialNumber: "SN123" }, { barcode: "BC123" }],
		tenant: "tenant123",
	});
	expect(mutateToArray).toHaveBeenCalled();
	expect(res.locals.message).toBe("Tool already exists");
	expect(res.status).toHaveBeenCalledWith(500);
	expect(res.redirect).toHaveBeenCalledWith("back");
	expect(req.logger.error).toHaveBeenCalledWith(
		expect.objectContaining({
			message: "Failed to create tool",
			metadata: expect.objectContaining({
				tenantId: "tenant123",
				userId: "user123",
				toolDetails: req.body,
			}),
			error: "Tool already exists",
		}),
	);
});
it("should update tool history when updating a tool", async () => {
	const mockTool = {
		_id: "123",
		save: jest.fn(),
		history: [],
	};
  mockTool.history.push = jest.fn();
	Tool.findByIdAndUpdate.mockResolvedValue(mockTool);

	const req = {
		body: {
			id: "123",
			modelNumber: "NewModel",
			description: "Updated description",
			serviceAssignment: "NewAssignment",
			category: "NewCategory",
			manufacturer: "NewManufacturer",
			width: 10,
			height: 20,
			length: 30,
			weight: 40,
		},
		user: { _id: "userId" },
	};
	const res = { locals: {}, status: jest.fn().mockReturnThis() };
	const next = jest.fn();

	await updateTool(req, res, next);

	expect(Tool.findByIdAndUpdate).toHaveBeenCalledWith(
		"123",
		expect.objectContaining({
			modelNumber: "NewModel",
			description: "Updated description",
			serviceAssignment: "NewAssignment",
			category: "NewCategory",
			manufacturer: "NewManufacturer",
			size: { width: 10, height: 20, length: 30, weight: 40 },
			$inc: { __v: 1 },
			updatedAt: expect.any(Number),
		}),
		{ new: true },
	);

	expect(mockTool.history.push).toHaveBeenCalledWith({
		updatedBy: "userId",
		serviceAssignment: "NewAssignment",
		status: undefined,
		changeDescription: "Service assignment updated to NewAssignment",
	});

	expect(mockTool.save).toHaveBeenCalled();
	expect(res.locals.tools).toEqual([mockTool]);
	expect(res.status).toHaveBeenCalledWith(200);
	expect(next).toHaveBeenCalled();
});
it("should handle cases where the tool to be archived is not found", async () => {
	const req = {
		params: { id: "nonexistentId" },
		user: { _id: "userId" },
		logger: {
			error: jest.fn(),
		},
	};
	const res = {
		status: jest.fn().mockReturnThis(),
		json: jest.fn(),
	};
	const next = jest.fn();

	Tool.findByIdAndUpdate.mockResolvedValue(null);

	await archiveTool(req, res, next);

	expect(Tool.findByIdAndUpdate).toHaveBeenCalledWith(
		"nonexistentId",
		{ archived: true },
		{ new: true },
	);
	expect(req.logger.error).toHaveBeenCalledWith({
		message: "Failed to archive tool",
		metadata: {
			toolId: "nonexistentId",
			userId: "userId",
		},
		error: "Tool with ID nonexistentId not found",
	});
	expect(res.status).toHaveBeenCalledWith(500);
	expect(res.json).toHaveBeenCalledWith({
		message: "Tool with ID nonexistentId not found",
	});
});
	it("should handle errors when saving updated tool information fails", async () => {
	  const mockTool = {
	    _id: "mockId",
	    save: jest.fn().mockRejectedValue(new Error("Save failed")),
	    history: {
	      push: jest.fn()
	    }
	  };
	  Tool.findByIdAndUpdate.mockResolvedValue(mockTool);

	  const req = {
	    body: {
	      id: "mockId",
	      modelNumber: "updatedModel",
	      description: "Updated description",
	      serviceAssignment: "newAssignment",
	      category: "newCategory",
	      manufacturer: "newManufacturer",
	      width: 10,
	      height: 20,
	      length: 30,
	      weight: 5,
	    },
	    user: { _id: "userId" },
	    logger: { error: jest.fn() },
	  };
	  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
	  const next = jest.fn();

	  await updateTool(req, res, next);

	  expect(Tool.findByIdAndUpdate).toHaveBeenCalledWith(
	    "mockId",
	    expect.objectContaining({
	      modelNumber: "updatedModel",
	      description: "Updated description",
	      serviceAssignment: "newAssignment",
	      category: "newCategory",
	      manufacturer: "newManufacturer",
	      size: { width: 10, height: 20, length: 30, weight: 5 },
	    }),
	    { new: true },
	  );
	  expect(mockTool.history.push).toHaveBeenCalledWith(
	    expect.objectContaining({
	      updatedBy: "userId",
	      serviceAssignment: "newAssignment",
	      changeDescription: "Service assignment updated to newAssignment",
	    }),
	  );
	  expect(mockTool.save).toHaveBeenCalled();
	  expect(req.logger.error).toHaveBeenCalledWith(
	    expect.objectContaining({
	      message: "Failed to update tool",
	      error: "Save failed",
	    }),
	  );
	  expect(res.status).toHaveBeenCalledWith(500);
	  expect(res.json).toHaveBeenCalledWith({ message: "Save failed" });
	});
it("should generate a printer-friendly tool list", async () => {
	const req = {
		user: {
			tenant: { valueOf: () => "testTenantId" },
		},
		logger: {
			info: jest.fn(),
			error: jest.fn(),
		},
	};
	const res = {
		locals: {
			tools: [
				{
					serialNumber: "123",
					modelNumber: "A1",
					toolID: "T1",
					barcode: "B1",
					description: "Tool 1",
				},
				{
					serialNumber: "456",
					modelNumber: "A2",
					toolID: "T2",
					barcode: "B2",
					description: "Tool 2",
				},
			],
		},
	};
	const next = jest.fn();

	await generatePrinterFriendlyToolList(req, res, next);

	expect(res.locals.printerFriendlyTools).toEqual([
		{
			serialNumber: "123",
			modelNumber: "A1",
			toolID: "T1",
			barcode: "B1",
			description: "Tool 1",
		},
		{
			serialNumber: "456",
			modelNumber: "A2",
			toolID: "T2",
			barcode: "B2",
			description: "Tool 2",
		},
	]);
	expect(req.logger.info).toHaveBeenCalledWith({
		message: "Printer-friendly tool list generated",
		metadata: {
			tenantId: "testTenantId",
			toolCount: 2,
		},
	});
	expect(next).toHaveBeenCalled();
});
it("should fetch all tools for a tenant and sort them", async () => {
  const mockReq = {
    user: {
      preferences: { sortField: "toolID", sortOrder: -1 },
      tenant: { valueOf: () => "testTenantId" },
      _id: "testUserId",
    },
  };
  const mockRes = { locals: {} };
  const mockNext = jest.fn();

  const mockTools = [
    { toolID: "T001", name: "Tool 1" },
    { toolID: "T002", name: "Tool 2" },
  ];

  Tool.find = jest.fn().mockReturnValue({
    sort: jest.fn().mockResolvedValue(mockTools),
  });

  await getAllTools(mockReq, mockRes, mockNext);

  expect(Tool.find).toHaveBeenCalledWith({ tenant: "testTenantId" });
  expect(Tool.find().sort).toHaveBeenCalledWith({ toolID: -1 });
  expect(mockRes.locals.tools).toEqual(mockTools);
  expect(mockNext).toHaveBeenCalledWith();
});