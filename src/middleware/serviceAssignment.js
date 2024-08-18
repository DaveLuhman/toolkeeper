/* eslint-disable eqeqeq */
import ServiceAssignment from '../models/ServiceAssignment.schema.js'
import { mutateToArray } from './util.js'
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
        const serviceAssignments = await ServiceAssignment.find()
            .sort('jobNumber')
            .lean()

        res.locals.settings_inactiveServiceAssignments =
            serviceAssignments.filter((item) => {
                return item.active === false
            })
        res.locals.settings_activeServiceAssignments =
            serviceAssignments.filter((item) => {
                return item.active === true
            })
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
        let active = false
        const { id, jobNumber, jobName, type, phone, notes } = req.body
        if (req.body.active === 'on') {
            active = true
        }
        const updatedServiceAssignment =
            await ServiceAssignment.findByIdAndUpdate(
                id,
                { jobNumber, jobName, type, phone, notes, active },
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
        const { jobNumber, jobName, type, phone, notes } = req.body
        const newServiceAssignment = await ServiceAssignment.create({
            jobNumber,
            jobName,
            type,
            phone,
            notes,
            active: true,
        })
        res.locals.serviceAssignments = mutateToArray(newServiceAssignment)
        return next()
    } catch (error) {
        console.error(error.message)
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
/**
 * @function deactivateServiceAssignment
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {void}
 * @description Deactivates a service assignment by ID
 */
export async function deactivateServiceAssignment(req, res, next) {
    try {
        const id = req.params.id
        await ServiceAssignment.findByIdAndUpdate(
            id,
            { active: false },
            { new: true }
        )
        return next()
    } catch (error) {
        console.error(error)
        res.status(500).send('Server Error')
    }
}
/**
 * Activates a service assignment by ID.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {void}
 */
export async function activateServiceAssignment(req, res, next) {
    try {
        const id = req.params.id
        await ServiceAssignment.findByIdAndUpdate(
            id,
            { active: true },
            { new: true }
        )
        return next()
    } catch (error) {
        console.error(error)
        res.status(500).send('Server Error')
    }
}
/**
 * Lists all active service assignments.
 * @param {*} _req
 * @param {*} res
 * @param {*} next
 * @returns {void}
 */
export async function listActiveSAs(_req, res, next) {
    res.locals.activeServiceAssignments = await ServiceAssignment.find()
        .where('active')
        .equals(true)
        .sort({
            jobNumber: 'asc',
        })
    return next()
}

/**
 * Retrieves all service assignments and sorts them by jobNumber in ascending order.
 * @param {Object} _req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
export async function listAllSAs(_req, res, next) {
    res.locals.allServiceAssignments = await ServiceAssignment.find().sort({
        jobNumber: 'asc',
    })
    return next()
}

/**
 * Retrieves the jobNumber and jobName of a service assignment based on its ID.
 * @param {Array} serviceAssignments - An array of service assignments.
 * @param {number} id - The ID of the service assignment to retrieve.
 * @returns {string} - The jobNumber and jobName of the service assignment, or 'Unassigned' if not found.
 */
export const getServiceAssignmentJobNumber = (serviceAssignments, id) => {
    try {
        const serviceAssignment = serviceAssignments.filter((item) => {
            return item.id == id
        })
        return `${serviceAssignment[0].jobNumber} - ${serviceAssignment[0].jobName}`
    } catch (error) {
        return 'Unassigned'
    }
}

/**
 * Finds a service assignment by jobNumber.
 * @param {string} jobNumber - The jobNumber of the service assignment to find.
 * @returns {Promise<string|null>} - A promise that resolves to the ID of the found service assignment, or null if not found.
 */
export const findServiceAssignmentByJobNumber = async (jobNumber) => {
    const sa = await ServiceAssignment.findOne({ jobNumber: { $eq: jobNumber } }).exec()
    return sa?.id
}
