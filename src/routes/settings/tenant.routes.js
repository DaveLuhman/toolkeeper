import { Router } from "express";
import { createTenantRedirect, renderTenantsPage } from "../../controllers/settings/tenant.js";
import { createTenant, getTenants } from "../../middleware/tenant.js";

export const tenantRouter = Router();

tenantRouter.get("/", getTenants, renderTenantsPage);
tenantRouter.post("/create", createTenant, createTenantRedirect)
