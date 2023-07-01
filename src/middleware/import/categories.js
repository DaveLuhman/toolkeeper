import { csvFileToEntries } from '../util.js'
import Category from '../../models/Category.model.js'

function createCategoryDocument (row) {
  const data = row.map((cell) => cell.trim())
  return { prefix: data[0], name: data[1], description: data[2] }
}

async function saveCategoryDocument (doc) {
  return await new Category(doc).save()
}

function createCategories (categories) {
  const categoryPromises = categories.map((c) => {
    const categoryDocument = createCategoryDocument(c)
    return saveCategoryDocument(categoryDocument)
  })
  return Promise.allSettled(categoryPromises)
}

export function importCategories (file) {
  const categories = csvFileToEntries(file)
  const successMsg = `${categories.length} Categories Submitted for import.`
  return createCategories(categories).then(() => ({ successMsg }))
}
