import mongoose from 'mongoose'

/**
 * Connects to the tenant database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {void}
 */
async function connectToTenantDatabase(req, res, next) {
  try {
    const tenantDb = await mongoose.connection.useDb(`tenant_${req.user.tenantId}`, {
      useCache: true,
    })
    req.tenantDb = tenantDb
    // should this be on the request or response
    next()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export default connectToTenantDatabase
