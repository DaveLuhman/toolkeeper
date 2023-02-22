import ServiceAssignment from '../models/ServiceAssignment.model.js'
import { mutateToArray } from './util.js'

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

// delete service assignment

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
