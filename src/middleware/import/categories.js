import { importedFileToArrayByRow } from '../util.js'
import Category from '../../models/Category.model.js'
function trimArrayValues (array) {
  for (let i = 0; i < array.length; i++) {
    array[i] = array[i].trim()
  }
  return array
}
async function lookupCategory (prefix) {
  return Category.findOne({ prefix })
}
async function checkForDuplicates (prefix) {
  return await lookupCategory(prefix)
    .then((result) => {
      if (!result) return false // didn't find anything, so lookup is falsey
      else return true
    }) // found a duplicate entry
    .catch((err) => {
      return err + 'error occured'
    })
}

async function createCategory (row) {
  row = trimArrayValues(row)
  const doc = {
    prefix: row[0],
    name: row[1],
    description: row[2]
  }
  try {
    if (await checkForDuplicates(doc.prefix)) {
      throw new Error('Duplicate serial number')
    }
    await Category.create(doc)
  } catch (err) {
    console.log(err)
  }
}

export function importCategories (file) {
  const importDataParentArray = importedFileToArrayByRow(file)
  const categories = []
  importDataParentArray.forEach((row) => {
    return categories.push(row.split(','))
  })
  const newCategories = []
  for (let i = 0; i < categories.length; i++) {
    newCategories.push(createCategory(categories[i]))
  }
  return newCategories.length + ' Tools Submitted for import.'
}
