import { Tool, ServiceAssignment } from "../../src/models/index.models.js";
import { getCheckedInTools } from "../../src/controllers/tool.js";
import mongoose from "mongoose";

jest.mock("../../src/models/index.models.js");

it("should return an empty array when there are no tools for the given tenant", async () => {
    const tenantId = "testTenantId";
    const logger = { error: jest.fn() };

    Tool.find.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        equals: jest.fn().mockResolvedValue([]),
    });

    ServiceAssignment.find.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        equals: jest.fn().mockResolvedValue([]),
    });

    const result = await getCheckedInTools(tenantId, logger);

    expect(result).toEqual([]);
    expect(logger.error).not.toHaveBeenCalled();
});

    it("should return checked-in tools for the given tenant", async () => {
        const tenantId = "testTenantId";
        const logger = { error: jest.fn() };

        const mockTools = [
            { _id: "tool1", serviceAssignment: "assignment1" },
            { _id: "tool2", serviceAssignment: "assignment2" },
        ];

        const mockServiceAssignments = [
            { _id: { equals: jest.fn().mockReturnValue(true) }, type: "Stockroom" },
            { _id: { equals: jest.fn().mockReturnValue(false) }, type: "Stockroom" },
        ];

        Tool.find.mockReturnValue({
            where: jest.fn().mockReturnThis(),
            equals: jest.fn().mockResolvedValue(mockTools),
        });

        ServiceAssignment.find.mockReturnValue({
            where: jest.fn().mockReturnThis(),
            equals: jest.fn().mockResolvedValue(mockServiceAssignments),
        });

        const result = await getCheckedInTools(tenantId, logger);

        expect(result).toEqual([mockTools[0]]);
        expect(logger.error).not.toHaveBeenCalled();
    });
