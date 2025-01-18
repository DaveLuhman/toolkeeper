export const renderTenantsPage = (_req, res) => {
	res.render("settings/tenants");
};

export const createTenantRedirect = (_req, res) => {
	res.status(201).redirect("/settings/tenant");
};

export const renderEditTenantPage = (_req, res) => {
	res.render("settings/editTenant");
};

// src\controllers\settings\tenant.js
