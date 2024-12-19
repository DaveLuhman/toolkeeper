import { Router } from "express";
import {
	createTenantRedirect,
	renderEditTenantPage,
	renderTenantsPage,
} from "../../controllers/settings/tenant.js";
import {
    applyImpersonation,
	createTenant,
	editTenant,
	getTenant,
	getTenants,
	impersonateTenant,
} from "../../middleware/tenant.js";
import { redirectToDashboard } from "../../controllers/index.js";

export const tenantRouter = Router();

tenantRouter.get("/", getTenants, renderTenantsPage);
tenantRouter.post("/create", createTenant, createTenantRedirect);
tenantRouter.get("/:tenantId/edit", getTenant, renderEditTenantPage);
tenantRouter.get("/:tenantId/impersonate", impersonateTenant, applyImpersonation, redirectToDashboard);
tenantRouter.get("/original/impersonate", impersonateTenant, applyImpersonation, redirectToDashboard);


// src\routes\settings\tenant.routes.js
