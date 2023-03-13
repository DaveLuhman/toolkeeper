import ServiceAssignment from '../models/ServiceAssignment.model.js'
import { mutateToArray } from './util.js'
/**
 * @function getServiceAssignments
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns  {void}
 * @description Gets all service assignments and adds them to res.locals.serviceAssignments as an array
 */
export async function getServiceAssignments (req, res, next) {
  try {
    const serviceAssignments = await ServiceAssignment.find()
    res.locals.serviceAssignments = mutateToArray(serviceAssignments)
    return next()
  } catch (error) {
    console.error(error)
    res.status(500).send('Server Error')
  }
}
/**
 * @function getServiceAssignmentByID
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {void}
 * @description Gets a service assignment by ID and adds it to res.locals.serviceAssignments as an array
 */
export async function getServiceAssignmentByID (req, res, next) {
  try {
    const id = req.params.id
    const serviceAssignment = await ServiceAssignment.findById({ $eq: id })
    res.locals.serviceAssignments = mutateToArray(serviceAssignment)
    return next()
  } catch (error) {
    console.error(error)
    res.status(500).send('Server Error')
  }
}
/**
 *  @function updateServiceAssignment
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {void}
 * @description Updates a service assignment by ID and adds it to res.locals.serviceAssignments as an array
 */
export async function updateServiceAssignment (req, res, next) {
  try {
    const { _id, vehicle, employee, jobName, jobNumber } = req.body
    const updatedServiceAssignment = await ServiceAssignment.findByIdAndUpdate(_id, { vehicle, employee, jobName, jobNumber }, { new: true }).exec()
    res.locals.serviceAssignments = mutateToArray(updatedServiceAssignment)
    return next()
  } catch (error) {
    console.error(error)
    res.status(500).send('Server Error')
  }
}
/**
 * @function createServiceAssignment
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return {void}
 * @description Creates a service assignment and adds it to res.locals.serviceAssignments as an array
 */
export async function createServiceAssignment (req, res, next) {
  try {
    const { vehicle, employee, jobName, jobNumber } = req.body
    const newServiceAssignment = await ServiceAssignment.create({ vehicle, employee, jobName, jobNumber })
    res.locals.serviceAssignments = mutateToArray(newServiceAssignment)
    return next()
  } catch (error) {
    console.error(error)
    res.status(500).send('Server Error')
  }
}

/**
 *  @function deleteServiceAssignment
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {void}
 * @description Deletes a service assignment by ID
 */

export async function deleteServiceAssignment (req, res, next) {
  try {
    const id = req.params.id
    await ServiceAssignment.findByIdAndDelete(id)
    return next()
  } catch (error) {
    console.error(error)
    res.status(500).send('Server Error')
  }
}
/**
 *  @function enumerateServiceAssignments
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns   {void}
 * @description Gets all service assignments and adds them to res.locals.serviceAssignments as an array specifically to be displayed in a table
 */
export async function enumerateServiceAssignments (req, res, next) {
  try {
    const serviceAssignments = await ServiceAssignment.find({}, { displayName: 1 })
    res.locals.serviceAssignments = mutateToArray(serviceAssignments)
    return next()
  } catch (error) {
    console.error(error)
    res.status(500).send('Server Error')
  }
}
