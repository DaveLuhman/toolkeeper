import { Router } from "express";
import {
	createTenantRedirect,
	renderEditTenantPage,
	renderTenantsPage,
} from "../../controllers/settings/tenant.js";
import {
	activateTenant,
	applyImpersonation,
	createTenant,
	deactivateTenant,
	deleteTenant,
	editTenant,
	getTenant,
	getTenants,
	impersonateTenant,
} from "../../middleware/tenant.js";
import { redirectToDashboard } from "../../controllers/index.js";

export const tenantRouter = Router();

tenantRouter.get("/", getTenants, renderTenantsPage);
tenantRouter.post("/create", createTenant, createTenantRedirect);
tenantRouter.get(
	"/:tenantId/activate",
	activateTenant,
	getTenants,
	renderTenantsPage,
);
tenantRouter.get(
	"/:tenantId/deactivate",
	deactivateTenant,
	getTenants,
	renderTenantsPage,
);
tenantRouter.get("/:tenantId/edit", getTenant, renderEditTenantPage);
tenantRouter.post("/:tenantId/edit", editTenant, getTenants, renderTenantsPage);
tenantRouter.get(
	"/:tenantId/delete",
	deleteTenant,
	getTenants,
	renderTenantsPage,
);
tenantRouter.get(
	"/:tenantId/impersonate",
	impersonateTenant,
	applyImpersonation,
	redirectToDashboard,
);
tenantRouter.get(
	"/original/impersonate",
	impersonateTenant,
	applyImpersonation,
	redirectToDashboard,
);

// src\routes\settings\tenant.routes.js
