/* eslint-disable eqeqeq */ // for the category name search
import Category from '../models/Category.model.js'

const getCategories = async (_req, res, next) => {
  try {
    const categories = await Category.find().sort({ prefix: 'asc' })
    res.locals.categories = categories
    return next()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
const getCategoryByID = async (req, res, next) => {
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
const updateCategory = async (req, res, next) => {
    const { _id, name, description } = req.body
    try {
      const updatedCategory = await Category.findByIdAndUpdate(
        { $eq: _id },
        { name, description },
        { new: true }
      )
      res.locals.updatedCategory = updatedCategory
      return next()
    } catch (error) {
      res.status(404).json({ message: error.message })
    }
  }
const createCategory = async (req, res, next) => {
  const category = req.body
  const newCategory = new Category(category)
  try {
    await newCategory.save()
    return next()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteCategory = async (req, res, next) => {
  const { id } = req.params
  try {
    await Category.findByIdAndRemove({ $eq: id })
    return next()
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}


// TODO: Use updatedAt value hashed to check for changes
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
