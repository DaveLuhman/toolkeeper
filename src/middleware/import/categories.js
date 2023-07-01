import { csvFileToEntries } from '../util.js'
import Category from '../../models/Category.model.js'
let successCount, errorCount
const errorList = []

function createCategoryDocument (row) {
  const data = row.map((cell) => cell.trim())
  return { prefix: data[0], name: data[1], description: data[2] }
}
function categoryDuplicate (prefix) {
  return Category.exists({ prefix }) !== null
}
async function saveCategoryDocument (doc) {
  try {
    if (categoryDuplicate) throw new Error('Duplicate Prefix')
    successCount++
    return await new Category(doc).save()
  } catch (error) {
    errorCount++
    errorList.push({ key: doc.prefix, reason: error.message })
  }
}

function createCategories (categories) {
  const categoryPromises = categories.map((c) => {
    const categoryDocument = createCategoryDocument(c)
    return saveCategoryDocument(categoryDocument)
  })
  return Promise.allSettled(categoryPromises)
}

export async function importCategories (file) {
  successCount = 0
  errorCount = 0
  errorList.length = 0
  const categories = csvFileToEntries(file)
  await createCategories(categories)
  return { successCount, errorCount }
}
