import toolkeeperProductObject, { checkoutUrl, inTestMode } from "../../src/config/lemonSqueezy";
jest.mock("../../src/config/lemonSqueezy.js");

describe("toolkeeperProductObject", () => {
  it('should return a complex object called attributes', async ()=>{
    const retValue = await toolkeeperProductObject()
    expect()
  })
});

describe("checkoutUrl", () => {
	it("should expose a function", () => {
		expect(checkoutUrl).toBeDefined();
	});

	it("checkoutUrl should return expected output", async () => {
		const retValue = await checkoutUrl();
		expect(retValue).toBeTruthy();
	});
});
describe("inTestMode", () => {
	it("should expose a function", () => {
		expect(inTestMode).toBeDefined();
	});

	it("inTestMode should return expected output", async () => {
		const retValue = await inTestMode();
		expect(retValue).toBeTruthy();
	});
});
