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

/**
 * Lists category names from the database and logs the operation.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the category names are listed.
 */
const listCategoryNames = async (req, res, next) => {
	try {
		// Log the start of the operation
		req.logger.info({
			message: "Fetching category names",
			tenantId: req.session?.user?.tenant?._id,
		});

		res.locals.categories = await Category.find(
			{
				tenant: { $eq: req.user.tenant.valueOf() },
			},
			{ name: 1, id: 1 },
		).sort({ name: "asc" });

		// Log success
		req.logger.info({
			message: "Category names fetched successfully",
			count: res.locals.categories.length,
		});
		return next();
	} catch (error) {
		// Log error
		req.logger.error({
			message: "Error fetching category names",
			error: error.message,
		});
		return next(error);
	}
};

/**
 * Handlebars helper function to look up the category name based on the id. Includes client-side logging.
 *
 * @param {Array} categories - Array of category objects.
 * @param {string} id - The ID of the category to retrieve.
 * @returns {string} - The name of the category, or 'Uncategorized' if not found.
 */
const getCategoryName = (categories, id) => {
	try {
		const category = categories.filter((item) => item._id === id);

		if (category.length === 0) {
			console.warn({ message: "Category not found", id });
			return "Uncategorized";
		}

		console.info({
			message: "Category found",
			categoryName: category[0].name,
		});
		return category[0].name;
	} catch (error) {
		console.error({
			message: "Error looking up category name",
			error: error.message,
		});
		return "Uncategorized";
	}
};

export {
	getCategories,
	getCategoryByID,
	createCategory,
	deleteCategory,
	updateCategory,
	listCategoryNames,
	getCategoryName,
};

// src\middleware\category.js
