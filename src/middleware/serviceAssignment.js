/* eslint-disable eqeqeq */
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
export async function getServiceAssignments (_req, res, next) {
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
    const { id, name, description } = req.body
    const updatedServiceAssignment = await ServiceAssignment.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    )
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
    const { name, description } = req.body
    const newServiceAssignment = await ServiceAssignment.create({
      name,
      description
    })
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

// TODO: Use updatedAt value hashed to check for changes
export async function listServiceAssignnmentNames (_req, res, next) {
  res.locals.serviceAssignments = await ServiceAssignment.find()
  return next()
}

export const getServiceAssignmentName = (categories, id) => {
  try {
    const category = categories.filter((item) => {
      return item.id == id
    })
    return category[0].name
  } catch (error) {
    return 'Unassigned'
  }
}
