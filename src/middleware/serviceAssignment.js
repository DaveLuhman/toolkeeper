import ServiceAssignment from '../models/ServiceAssignment.model.js'

export async function getServiceAssignments (req, res, next) {
  try {
    const serviceAssignments = await ServiceAssignment.find()
    res.locals.serviceAssignments = serviceAssignments
    return next()
  } catch (error) {
    console.error(error)
    res.status(500).send('Server Error')
  }
}
