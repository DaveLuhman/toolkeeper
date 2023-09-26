/* eslint-disable eqeqeq */ // for the category name search
import Category from '../models/Category.model.js'
import Tool from '../models/Tool.model.js'

const getCategories = async (_req, res, next) => {
  try {
    const categories = await Category.find()
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
function uncategorizeTools(toolsArray) {
  toolsArray.forEach((tool) => {
    const updatedTool = Tool.findByIdAndUpdate(tool.id, { category: '64a1c3d8d71e121dfd39b7ab' }, false).exec()
  })
}
const deleteCategory = async (req, res, next) => {
  const { id } = req.params
  try {
    let tools = await Tool.find({ category: { $eq: id } })
    console.log('There are this many tools:  ' + tools.length)
    Promise.resolve(uncategorizeTools(tools))
    tools = await Tool.find({ category: { $eq: id } })
    if (tools.length === 0) {
      console.log('There are no more tools and it is safe to delete this category')
      await Category.findByIdAndRemove({ $eq: id })
      return next()
    }
    else {
      throw new Error('There are still tools with this category, so it cannot be deleted.')
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateCategory = async (req, res, next) => {
  const { id, name, description } = req.body
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      { $eq: id },
      { name, description },
      { new: true }
    )
    res.locals.updatedCategory = updatedCategory
    return next()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
// TODO: Use updatedAt value hashed to check for changes
const listCategoryNames = async (_req, res, next) => {
  res.locals.categories = await Category.find({}, { name: 1, id: 1 })
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
