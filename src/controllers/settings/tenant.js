
export const renderTenantsPage = (_req, res) => {
    res.render('settings/tenants')
}

export const createTenantRedirect = (_req, res) => {
  res.status(201).redirect('settings/tenants');
};