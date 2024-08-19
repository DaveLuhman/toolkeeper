/* eslint-disable eqeqeq */ // for the category name search
import { Category } from '../models/index.models.js'

/**
 * Retrieves categories.
 * @param {Object} _req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const getCategories = async function (_req, res, next) {
  try {
    const categories = await Category.find().where("tenant").equals(req.tenantId).sort({ prefix: 'asc' })
    res.locals.categories = categories
    return next()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
/**
 * Retrieves a category by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const getCategoryByID = async function (req, res, next) {
  const { id } = req.params
  try {
    const category = await Category.findById({ $eq: id })
    res.locals.categories = [category]
    return next()
  } catch (error) {
    res.status(500).json({ message: error.message })
    next()
  }
}
/**
 * Updates a category in the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the category is updated.
 */
const updateCategory = async function (req, res, next) {
  const { _id, name, description } = req.body
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      { _id },
      { name, description },
      { new: true }
    )
    res.locals.updatedCategory = updatedCategory
    return next()
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}
/**
 * Creates a new category in the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the category is created.
 */
const createCategory = async function (req, res, next) {
  const category = req.body
  const newCategory = new Category(category)
  try {
    await newCategory.save()
    return next()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * Deletes a category by its ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the category is deleted.
 */
const deleteCategory = async function (req, res, next) {
  const { id } = req.params
  try {
    await Category.findByIdAndRemove({ $eq: id })
    return next()
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}


/**
 * Lists category names from the database.
 *
 * @param {Object} _req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the category names are listed.
 */
const listCategoryNames = async (_req, res, next) => {
  res.locals.categories = await Category.find({}, { name: 1, id: 1 }).sort({ name: 'asc' })
  return next()
}

// write a handlebars helper to lookup the category name based on the id
// https://stackoverflow.com/questions/28223460/handlebars-js-lookup-value-in-array-of-objects
const getCategoryName = (categories, id) => {
  try {
    const category = categories.filter((item) => {
      return item.id == id
    })
    return category[0].name
  } catch (error) {
    return 'Uncategorized'
  }
}

export {
  getCategories,
  getCategoryByID,
  createCategory,
  deleteCategory,
  updateCategory,
  listCategoryNames,
  getCategoryName
}
