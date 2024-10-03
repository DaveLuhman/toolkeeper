import { Log } from "../../models/index.models.js";
import logger from "../../logging/index.js";
import tenantLogger, { renderLogView } from "../../logging/middleware.js";

jest.mock("../models/index.models.js");
jest.mock("./index.js");

describe('renderLogView', () => {
  it('should expose a function', () => {
		expect(renderLogView).toBeDefined();
	});

  it('renderLogView should return expected output', async () => {
    // const retValue = await renderLogView(req,res,next);
    expect(false).toBeTruthy();
  });
});
describe('tenantLogger', () => {
  it('should expose a function', () => {
		expect(tenantLogger).toBeDefined();
	});

  it('tenantLogger should return expected output', () => {
    // const retValue = tenantLogger(req,res,next);
    expect(false).toBeTruthy();
  });
});