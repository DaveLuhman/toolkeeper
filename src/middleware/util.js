import { listCategoryNames } from './category.js'
import { listServiceAssignnmentNames } from './serviceAssignment.js'

/**
 *
 * @param {array} data
 * @param {number} targetPage
 * @param {number} perPage
 * @returns {object} trimmedData, targetPage, pageCount
 */
export function paginate (data, targetPage, perPage) {
  perPage = perPage || 10
  targetPage = targetPage || 1
  const pageCount = Math.ceil(data.length / perPage) // number of pages
  const trimmedData = data.slice(
    perPage * targetPage - perPage,
    perPage * targetPage + 1
  )
  return { trimmedData, targetPage, pageCount }
}

// mutate to array
/**
 * @param {any} data input data, typically before being rendered by handlebars
 * @returns {array}
 * This function will mutate the data to an array
 */
export function mutateToArray (data) {
  if (!Array.isArray(data)) {
    data = [data]
  }
  return data
}

export function sortByUserPreference (data, sortField, sortOrder) {
  if (sortOrder === 'asc') {
    data.sort((a, b) => a[sortField] - b[sortField])
  } else {
    data.sort((a, b) => b[sortField] - a[sortField])
  }
  return data
}

/**
 * @param {string} string
 * @returns {string} sanitized data
 * This function will sanitize user input to prevent XSS attacks
 * It will only allow alphanumeric characters and spaces
 **/
function sanitize (string) {
  return string.replace(/[^a-zA-Z0-9\-@. ]/g, '')
}

/**
 * @param {object} req.body
 * @param {*} res
 * @param {*} next
 * @returns {object} sanitized req.body
 * This function will sanitize the request body
 * It will only allow alphanumeric characters and spaces
 * It will mutate the req.body
 **/
export function sanitizeReqBody (req, _res, next) {
  for (const key in req.body) {
    req.body[key] = sanitize(req.body[key])
  }
  return next()
}
export function isSelected (option, objectProperty) {
  console.log(String.toString(option), String.toString(objectProperty))
  console.log(option, objectProperty)
  if (toString(option) === toString(objectProperty)) return 'selected'
}

export const populateDropdownItems = [listCategoryNames, listServiceAssignnmentNames]
