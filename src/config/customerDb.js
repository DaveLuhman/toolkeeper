import { connection } from 'mongoose';

async function connectToCustomerDatabase (req, res, next) {
  try {
    const customerDB = connection.useDb(`tenant_${req.params.tenantId}`, {
      useCache: true
    })
    req.customerDB = customerDB
    // should this be on the request or response
    next()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export default customerDB