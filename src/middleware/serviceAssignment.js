import { ServiceAssignment } from "../models/index.models.js";
import { mutateToArray } from "./util.js";

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

export default {
	getServiceAssignments,
	getServiceAssignmentByID,
	updateServiceAssignment,
	createServiceAssignment,
	deleteServiceAssignment,
};

// src\middleware\serviceAssignment.js
