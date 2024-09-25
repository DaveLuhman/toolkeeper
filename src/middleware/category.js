import { Category } from "../models/index.models.js";

/**
 * Retrieves categories.
 */
const getCategories = async (req, res, next) => {
	try {
		const categories = await Category.find({
			tenant: { $eq: req.user.tenant.valueOf() },
		}).sort({ prefix: "asc" });
		res.locals.categories = categories;
		return next();
	} catch (error) {
		req.logger.error({
			message: "Failed to fetch categories",
			metadata: { tenantId: req.user.tenant.valueOf() },
			error: error.message,
		});
		res.status(500).json({ message: error.message });
	}
};

/**
 * Retrieves a category by ID.
 */
const getCategoryByID = async (req, res, next) => {
	const { id } = req.params;
	try {
		const category = await Category.findById({ _id: id });
		res.locals.categories = [category];
		return next();
	} catch (error) {
		req.logger.error({
			message: `Failed to fetch category with ID ${id}`,
			metadata: { categoryId: id, tenantId: req.user.tenant.valueOf() },
			error: error.message,
		});
		res.status(500).json({ message: error.message });
	}
};

/**
 * Creates a new category in the database.
 */
const createCategory = async (req, res, next) => {
	const category = req.body;
	const newCategory = new Category(category);
	try {
		await newCategory.save();
		return next();
	} catch (error) {
		req.logger.error({
			message: "Failed to create category",
			metadata: {
				categoryDetails: req.body,
				tenantId: req.user.tenant.valueOf(),
			},
			error: error.message,
		});
		res.status(500).json({ message: error.message });
	}
};

/**
 * Updates a category in the database.
 */
const updateCategory = async (req, res, next) => {
	const { _id, name, description } = req.body;
	try {
		const updatedCategory = await Category.findByIdAndUpdate(
			{ _id },
			{ name, description },
			{ new: true },
		);
		res.locals.updatedCategory = updatedCategory;
		return next();
	} catch (error) {
		req.logger.error({
			message: `Failed to update category with ID ${_id}`,
			metadata: { categoryId: _id, tenantId: req.user.tenant.valueOf() },
			error: error.message,
		});
		res.status(500).json({ message: error.message });
	}
};

/**
 * Deletes a category by its ID.
 */
const deleteCategory = async (req, res, next) => {
	const { id } = req.params;
	try {
		await Category.findByIdAndRemove({ _id: id });
		return next();
	} catch (error) {
		req.logger.error({
			message: `Failed to delete category with ID ${id}`,
			metadata: { categoryId: id, tenantId: req.user.tenant.valueOf() },
			error: error.message,
		});
		res.status(500).json({ message: error.message });
	}
};

export {
	getCategories,
	getCategoryByID,
	createCategory,
	deleteCategory,
	updateCategory,
};

// src\middleware\category.js
