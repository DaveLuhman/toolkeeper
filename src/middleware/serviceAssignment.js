import { ServiceAssignment } from "../models/index.models.js";
import { mutateToArray } from "./util.js";
import logger from "../logging/index.js";
/**
 * Gets all service assignments.
 */
export async function getServiceAssignments(req, res, next) {
	try {
		const serviceAssignments = await ServiceAssignment.find({
			tenant: { $eq: req.user.tenant.valueOf() },
		})
			.sort("jobNumber")
			.lean();
		res.locals.settings_inactiveServiceAssignments = serviceAssignments.filter(
			(item) => item.active === false,
		);
		res.locals.settings_activeServiceAssignments = serviceAssignments.filter(
			(item) => item.active === true,
		);
		return next();
	} catch (error) {
		req.logger.error({
			message: "Failed to fetch service assignments",
			metadata: { tenantId: req.user.tenant.valueOf() },
			error: error.message,
		});
		res.status(500).json({ message: error.message });
	}
}

/**
 * Gets a service assignment by ID.
 */
export async function getServiceAssignmentByID(req, res, next) {
	const { id } = req.params;
	try {
		const serviceAssignment = await ServiceAssignment.findById({ _id: id });
		res.locals.targetServiceAssignment = mutateToArray(serviceAssignment);
		return next();
	} catch (error) {
		req.logger.error({
			message: `Failed to fetch service assignment with ID ${id}`,
			metadata: {
				serviceAssignmentId: id,
				tenantId: req.user.tenant.valueOf(),
			},
			error: error.message,
		});
		res.status(500).json({ message: error.message });
	}
}

/**
 * Updates a service assignment by ID.
 */
export async function updateServiceAssignment(req, res, next) {
	const { id, jobNumber, jobName, type, phone, notes } = req.body;
	const active = !!(req.body.active === "on");
	try {
		const updatedServiceAssignment = await ServiceAssignment.findByIdAndUpdate(
			id,
			{ jobNumber, jobName, type, phone, notes, active },
			{ new: true },
		);
		res.locals.serviceAssignments = mutateToArray(updatedServiceAssignment);
		return next();
	} catch (error) {
		req.logger.error({
			message: `Failed to update service assignment with ID ${id}`,
			metadata: {
				serviceAssignmentId: id,
				tenantId: req.user.tenant.valueOf(),
			},
			error: error.message,
		});
		res.status(500).json({ message: error.message });
	}
}

/**
 * Creates a service assignment.
 */
export async function createServiceAssignment(req, res, next) {
	const { jobNumber, jobName, type, phone, notes } = req.body;
	try {
		const newServiceAssignment = await ServiceAssignment.create({
			jobNumber,
			jobName,
			type,
			phone,
			notes,
			active: true,
			tenant: req.user.tenant.valueOf(),
		});
		res.locals.serviceAssignments = mutateToArray(newServiceAssignment);
		return next();
	} catch (error) {
		req.logger.error({
			message: "Failed to create service assignment",
			metadata: {
				serviceAssignmentDetails: req.body,
				tenantId: req.user.tenant.valueOf(),
			},
			error: error.message,
		});
		res.status(500).json({ message: error.message });
	}
}

/**
 * Deletes a service assignment by ID.
 */
export async function deleteServiceAssignment(req, res, next) {
	const { id } = req.params;
	try {
		await ServiceAssignment.findByIdAndDelete(id);
		return next();
	} catch (error) {
		req.logger.error({
			message: `Failed to delete service assignment with ID ${id}`,
			metadata: {
				serviceAssignmentId: id,
				tenantId: req.user.tenant.valueOf(),
			},
			error: error.message,
		});
		res.status(500).json({ message: error.message });
	}
}

/**
 * Lists all active service assignments and logs the request.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {void}
 */
export async function listActiveSAs(req, res, next) {
    try {
        // Log that the operation has started
        req.logger.info({ message: 'Fetching active service assignments', tenantId: req.session?.user?.tenant?._id });

        res.locals.activeServiceAssignments = await ServiceAssignment.find({
            tenant: { $eq: req.user.tenant.valueOf() },
            active: true
        }).sort({ jobNumber: 'asc' });

        // Log success
        req.logger.info({ message: 'Active service assignments fetched successfully', count: res.locals.activeServiceAssignments.length });
        return next();
    } catch (error) {
        // Log error and pass it to the error handler middleware
        req.logger.error({ message: 'Error fetching active service assignments', error: error.message });
        return next(error);
    }
}

/**
 * Retrieves all service assignments and sorts them by jobNumber in ascending order. Adds appropriate logging.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
export async function listAllSAs(req, res, next) {
    try {
        // Log the start of the operation
        req.logger.info({ message: 'Fetching all service assignments', tenantId: req.session?.user?.tenant?._id });

        res.locals.allServiceAssignments = await ServiceAssignment.find({
            tenant: { $eq: req.user.tenant.valueOf() }
        }).sort({ jobNumber: 'asc' });

        // Log success
        req.logger.info({ message: 'All service assignments fetched successfully', count: res.locals.allServiceAssignments.length });
        return next();
    } catch (error) {
        // Log error and pass it to the error handler middleware
        req.logger.error({ message: 'Error fetching all service assignments', error: error.message });
        return next(error);
    }
}

/**
 * Retrieves the jobNumber and jobName of a service assignment based on its ID. Adds logging when service assignments are processed.
 * @param {Array} serviceAssignments - An array of service assignments.
 * @param {number} id - The ID of the service assignment to retrieve.
 * @returns {string} - The jobNumber and jobName of the service assignment, or 'Unassigned' if not found.
 */
export const getServiceAssignmentJobNumber = (serviceAssignments, id) => {
    try {
        const serviceAssignment = serviceAssignments.filter((item) => item._id.valueOf() === id);

        if (serviceAssignment.length === 0) {
            logger.warn({ message: 'Service assignment not found', id });
            return 'Unassigned';
        }

        logger.info({ message: 'Service assignment found', jobNumber: serviceAssignment[0].jobNumber });
        return `${serviceAssignment[0].jobNumber} - ${serviceAssignment[0].jobName}`;
    } catch (error) {
        logger.error({ message: 'Error retrieving service assignment', error: error.message });
        return 'Unassigned';
    }
};

/**
 * Finds a service assignment by jobNumber and logs the search.
 * @param {string} jobNumber - The jobNumber of the service assignment to find.
 * @returns {Promise<string|null>} - A promise that resolves to the ID of the found service assignment, or null if not found.
 */
export const findServiceAssignmentByJobNumber = async (jobNumber) => {
    try {
        req.logger.info({ message: 'Searching for service assignment by jobNumber', jobNumber });

        const sa = await ServiceAssignment.findOne({
            jobNumber: { $eq: jobNumber },
            tenant: { $eq: req.user.tenant.valueOf() }
        }).exec();

        if (!sa) {
            req.logger.warn({ message: 'Service assignment not found by jobNumber', jobNumber });
            return null;
        }

        req.logger.info({ message: 'Service assignment found by jobNumber', id: sa.id });
        return sa.id;
    } catch (error) {
        req.logger.error({ message: 'Error finding service assignment by jobNumber', error: error.message });
        return null;
    }
};
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
export default {
	getServiceAssignments,
	getServiceAssignmentByID,
	updateServiceAssignment,
	createServiceAssignment,
	deleteServiceAssignment,
    findServiceAssignmentByJobNumber,
    activateServiceAssignment,
    deactivateServiceAssignment
};

// src\middleware\serviceAssignment.js
