/*
List of Functions in order (* means exported)
*paginate
*mutateToArray
*sortByUserPreference
sanitize
*sanitizeReqBody
*isSelected
*populateDropdownItems (const, not function)
*rateLimiter
*createAccountLimiter
*csvFileToEntries
*getPackageVersion
*hoistSearchParamsToBody
*/

import rateLimit from 'express-rate-limit'
import { listCategoryNames } from './category.js'
import { listActiveSAs } from './serviceAssignment.js'
import xss from 'xss'

/**
 *
 * @param {array} data
 * @param {number} targetPage
 * @param {number} perPage
 * @returns {object} trimmedData, targetPage, pageCount
 */
export function paginate(data, targetPage, perPage) {
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
 * This function will mutate the data to an array if it's not already one, but won't nest an existing array
 */
export function mutateToArray(data) {
  if (!Array.isArray(data)) {
    data = [data]
  }
  return data
}

export function sortByUserPreference(data, sortField, sortOrder) {
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
function sanitize(string) {
  return xss(string)
}

/**
 * @param {object} req.body
 * @param {*} res
 * @param {*} next
 * @returns {object} sanitized req.body
 * This function will sanitize the request body
 * It will only allow alphanumeric characters and - @ . (required for emails)
 **/
export function sanitizeReqBody(req, _res, next) {
  for (const key in req.body) {
    req.body[key] = sanitize(req.body[key])
  }
  return next()
}
/**
 *
 * @param {string} option option in the list
 * @param {string} objectProperty property on the object you want checked
 * @returns
 */
export function isSelected(option, objectProperty) {
  if (option === objectProperty) return 'selected'
}

export const populateDropdownItems = [listCategoryNames, listActiveSAs]

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

export const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 create account requests per `window` (here, per hour)
  message:
    'Too many accounts created from this IP, please try again after an hour',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

export function csvFileToEntries(file) {
  return Buffer.from(file.data)
    .toString('ascii')
    .replace("'", '')
    .replaceAll('"', '')
    .split(/\r?\n/)
    .map((row) => row.split(','))
}

export function getPackageVersion() {
  return process.env.npm_package_version
}

export function hoistSearchParamsToBody(req, _res, next) {
  if (req.body.searchBy === undefined) {
    const { searchBy, searchTerm } = req.query
    req.body.searchBy = searchBy
    req.body.searchTerm = searchTerm
  }
  next()
}

export function deduplicateArray(arr) {
  return Array.from(new Set(arr)).filter((item) => item !== '') 
}
export function searchingForOneTool(searchBy) {
  const searchesReturningOneTool = [
    'serialNumber',
    'barcode',
    'status',
    'modelNumber',
    'toolID',
  ]
  return searchesReturningOneTool.includes(searchBy)
}

// Custom error class
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

// Centralized error handling middleware
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (err.statusCode === 404) {
    res.status(err.statusCode).render('error/404', {
      errorCode: err.statusCode,
      errorMessage: err.message,
      errorStack: err.stack,
    })
  } else {
    res.status(err.statusCode).render('error/error', {
      errorCode: err.statusCode,
      errorMessage: err.message,
      errorStack: err.stack,
    })
  }
}

export const returnUniqueIdentifier = (toolDocument) => {
  try {
    const { toolID, barcode, serialNumber } = toolDocument
    if (toolID) {
      return `Tool ID ${toolID}`
    } else if (barcode) {
      return `Barcode: ${barcode}`
    } else if (serialNumber) {
      return `SN: ${serialNumber}`
    }
  } catch (error) {
    return 'Unable to uniquely identify this tool'
  }
}
