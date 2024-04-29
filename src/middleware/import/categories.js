import { csvFileToEntries } from '../util.js'
import Category from '../../models/Category.model.js'
let successCount
const errorList = []

function createCategoryDocument(row) {
  const data = row.map((cell) => cell.trim())
  const description = data[2] || ''
  return { prefix: data[0], name: data[1], description }
}

async function checkDuplicate(prefix) {
  const dup = await Category.find({ prefix })
  return dup.length !== 0
}

async function saveCategoryDocument(doc) {
  try {
    if (await checkDuplicate(doc.prefix)) throw new Error('Duplicate Prefix')
    successCount++
    return await Category.create(doc)
  } catch (error) {
    errorList.push({ key: doc.prefix, reason: error.message })
  }
}

async function createCategories(entries) {
  const categoryPromises = entries.map((entry) => {
    const doc = createCategoryDocument(entry)
    return saveCategoryDocument(doc)
  })
  return Promise.all(categoryPromises)
}

export async function importCategories(file) {
  successCount = 0
  errorList.length = 0
  const entries = csvFileToEntries(file)
  await createCategories(entries)
  return { successCount, errorList }
}
