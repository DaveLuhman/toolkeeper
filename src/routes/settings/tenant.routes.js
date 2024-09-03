import { Router } from "express";
import { renderTenantsPage } from "../../controllers/settings/tenant.js";
import { getTenants } from "../../middleware/tenant.js";

export const tenantRouter = Router();

tenantRouter.get("/", getTenants, renderTenantsPage);
