/* eslint-disable eqeqeq */
import User from '../models/User.model.js'
import ServiceAssignment from '../models/ServiceAssignment.model.js'
import { mutateToArray, paginate } from './util.js'
/**
 * @function getServiceAssignments
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns  {void}
 * @description Gets all service assignments and adds them to res.locals.serviceAssignments as an array
 */
export async function getServiceAssignments(req, res, next) {
  console.info('[MW] getServiceAssignments-in'.bgBlue.white)
  try {
    const serviceAssignments = await ServiceAssignment.find().sort('name').exec()
    const { trimmedData, targetPage, pageCount } = paginate(
      serviceAssignments,
      req.query.p || 1,
      req.user.preferences.pageSize
    )
    res.locals.inactiveServiceAssignments = serviceAssignments.filter((item) => { return item.active === false })
    res.locals.activeServiceAssignments = serviceAssignments.filter((item) => { return item.active === true })
    res.locals.pagination = { page: targetPage, pageCount } // pagination
    console.info('[MW] getServiceAssignments-out'.bgWhite.blue)
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
export async function getServiceAssignmentByID(req, res, next) {
  try {
    const id = req.params.id
    const serviceAssignment = await ServiceAssignment.findById({ $eq: id })
    res.locals.targetServiceAssignment = mutateToArray(serviceAssignment)
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
export async function updateServiceAssignment(req, res, next) {
  try {
    let active = false;
    const { id, name, description, type, phone, notes } = req.body
    if (req.body.active === 'on') { active = true }
    const updatedServiceAssignment = await ServiceAssignment.findByIdAndUpdate(
      id,
      { name, description, type, phone, notes, active },
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
export async function createServiceAssignment(req, res, next) {
  try {
    const { name, description, type, phone, notes } = req.body
    const newServiceAssignment = await ServiceAssignment.create({
      name,
      description,
      type,
      phone,
      notes,
      active: true
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

export async function deleteServiceAssignment(req, res, next) {
  try {
    const id = req.params.id
    await ServiceAssignment.findByIdAndDelete(id)
    return next()
  } catch (error) {
    console.error(error)
    res.status(500).send('Server Error')
  }
}
export async function deactivateServiceAssignment(req, res, next) {
  try {
    const id = req.params.id
    await ServiceAssignment.findByIdAndUpdate(id, { active: false }, { new: true })
    return next()
  } catch (error) {
    console.error(error)
    res.status(500).send('Server Error')
  }
}
export async function activateServiceAssignment(req, res, next) {
  try {
    const id = req.params.id
    await ServiceAssignment.findByIdAndUpdate(id, { active: true }, { new: true })
    return next()
  } catch (error) {
    console.error(error)
    res.status(500).send('Server Error')
  }
}

// TODO: Use updatedAt value hashed to check for changes
export async function listActiveSAs(_req, res, next) {
  res.locals.activeServiceAssignments = await ServiceAssignment.find().where('active').equals(true).sort({
    name: 'asc'
  })
  return next()
}

export async function listAllSAs(_req, res, next) {
  res.locals.allServiceAssignments = await ServiceAssignment.find().sort({
    name: 'asc'
  })
  return next()
}

export const getServiceAssignmentName = (serviceAssignments, id) => {
  try {
    const serviceAssignment = serviceAssignments.filter((item) => {
      return item.id == id
    })
    return serviceAssignment[0].name + ' - ' + serviceAssignment[0].description
  } catch (error) {
    return 'Unassigned'
  }
}
