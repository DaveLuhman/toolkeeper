import moment from "moment";
import { Tool, ServiceAssignment } from "../../models/index.models.js";
import { deduplicateArray, mutateToArray } from "../../middleware/util.js";
import { returnUniqueIdentifier } from "../../helpers/index.js";
import sortArray from "sort-array";
import { findServiceAssignmentByJobNumber } from "../../middleware/serviceAssignment.js";
import { getAllTools, getActiveTools, getToolByID, searchTools, createTool, updateTool, archiveTool, unarchiveTool, checkTools, submitCheckInOut, generatePrinterFriendlyToolList } from "../../middleware/tool.js";

jest.mock("moment");
jest.mock("../models/index.models.js");
jest.mock("./util.js");
jest.mock("../helpers/index.js");
jest.mock("sort-array");
jest.mock("./serviceAssignment.js");

describe('getAllTools', () => {
  it('should expose a function', () => {
		expect(getAllTools).toBeDefined();
	});

  it('getAllTools should return expected output', async () => {
    // const retValue = await getAllTools(req,res,next);
    expect(false).toBeTruthy();
  });
});
describe('getActiveTools', () => {
  it('should expose a function', () => {
		expect(getActiveTools).toBeDefined();
	});

  it('getActiveTools should return expected output', async () => {
    // const retValue = await getActiveTools(req,res,next);
    expect(false).toBeTruthy();
  });
});
describe('getToolByID', () => {
  it('should expose a function', () => {
		expect(getToolByID).toBeDefined();
	});

  it('getToolByID should return expected output', async () => {
    // const retValue = await getToolByID(req,res,next);
    expect(false).toBeTruthy();
  });
});
describe('searchTools', () => {
  it('should expose a function', () => {
		expect(searchTools).toBeDefined();
	});

  it('searchTools should return expected output', async () => {
    // const retValue = await searchTools(req,res,next);
    expect(false).toBeTruthy();
  });
});
describe('createTool', () => {
  it('should expose a function', () => {
		expect(createTool).toBeDefined();
	});

  it('createTool should return expected output', async () => {
    // const retValue = await createTool(req,res,next);
    expect(false).toBeTruthy();
  });
});
describe('updateTool', () => {
  it('should expose a function', () => {
		expect(updateTool).toBeDefined();
	});

  it('updateTool should return expected output', async () => {
    // const retValue = await updateTool(req,res,next);
    expect(false).toBeTruthy();
  });
});
describe('archiveTool', () => {
  it('should expose a function', () => {
		expect(archiveTool).toBeDefined();
	});

  it('archiveTool should return expected output', async () => {
    // const retValue = await archiveTool(req,res,next);
    expect(false).toBeTruthy();
  });
});
describe('unarchiveTool', () => {
  it('should expose a function', () => {
		expect(unarchiveTool).toBeDefined();
	});

  it('unarchiveTool should return expected output', async () => {
    // const retValue = await unarchiveTool(req,res,next);
    expect(false).toBeTruthy();
  });
});
describe('checkTools', () => {
  it('should expose a function', () => {
		expect(checkTools).toBeDefined();
	});

  it('checkTools should return expected output', async () => {
    // const retValue = await checkTools(req,res,next);
    expect(false).toBeTruthy();
  });
});
describe('submitCheckInOut', () => {
  it('should expose a function', () => {
		expect(submitCheckInOut).toBeDefined();
	});

  it('submitCheckInOut should return expected output', async () => {
    // const retValue = await submitCheckInOut(req,res,next);
    expect(false).toBeTruthy();
  });
});
describe('generatePrinterFriendlyToolList', () => {
  it('should expose a function', () => {
		expect(generatePrinterFriendlyToolList).toBeDefined();
	});

  it('generatePrinterFriendlyToolList should return expected output', async () => {
    // const retValue = await generatePrinterFriendlyToolList(req,res,next);
    expect(false).toBeTruthy();
  });
});