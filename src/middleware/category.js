import Category from '../models/Category.model.js'

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

const deleteCategory = async (req, res, next) => {
  const { id } = req.params
  try {
    await Category.findByIdAndRemove({ $eq: id })
    return next()
  } catch (error) {
    res.status(404).json({ message: error.message })
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

const listCategoryNames = async (_req, res, next) => {
  const categories = await Category.find({}, { name: 1 })
  console.log(categories)
  res.locals.categories = categories
  return next()
}

export {
  getCategories,
  getCategoryByID,
  createCategory,
  deleteCategory,
  updateCategory,
  listCategoryNames
}
