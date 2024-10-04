import { renderLandingPage } from "../../src/controllers/index.js";

it("should handle a request with valid parameters and return a successful response", () => {
    const req = {};
    const res = {
        render: jest.fn(),
    };

    renderLandingPage(req, res);

    expect(res.render).toHaveBeenCalledWith('index', { layout: 'public.hbs' });
});

it("should correctly handle an empty request body and return a default response", () => {
    const req = {};
    const res = {
        render: jest.fn(),
    };

    renderLandingPage(req, res);

    expect(res.render).toHaveBeenCalledWith('index', { layout: 'public.hbs' });
});

it("should return a 200 status code when the landing page is rendered successfully", () => {
    const req = {};
    const res = {
        render: jest.fn(),
        status: jest.fn().mockReturnThis(),
    };

    renderLandingPage(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.render).toHaveBeenCalledWith('index', { layout: 'public.hbs' });
});
