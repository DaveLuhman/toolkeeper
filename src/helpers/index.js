// skipcq: JS-0257
import moment from 'moment'
import handlebarsHelpers from 'handlebars-helpers'
import { getCategoryName } from '../middleware/category.js'
import { getServiceAssignmentJobNumber } from '../middleware/serviceAssignment.js'
/**
 *
 * @param {array} data
 * @param {number} targetPage
 * @param {number} perPage
 * @returns {object} trimmedData, targetPage, pageCount
 */
function paginate(data, targetPage, perPage) {
    perPage = perPage || 10
    targetPage = targetPage || 1
    const pageCount = Math.ceil(data.length / perPage) // number of pages
    const trimmedData = data.slice(
      perPage * targetPage - perPage,
      perPage * targetPage + 1
    )
    return { trimmedData, targetPage, pageCount }
  }
  /**
 *
 * @param {string} option option in the list
 * @param {string} objectProperty property on the object you want checked
 * @returns
 */
function isSelected(option, objectProperty) {
    if (option === objectProperty) return 'selected'
    return null
  }
  /**
 * Retrieves the current package version from the environment variables.
 * @returns {string} The current package version.
 */
function getPackageVersion() {
    return process.env.npm_package_version
  }
  /**
 * Checks if the search parameter is expected to return only one tool.
 *
 * @param {string} searchBy - The search parameter.
 * @returns {boolean} - True if the search parameter is expected to return only one tool, false otherwise.
 */
function searchingForOneTool(searchBy) {
    const searchesReturningOneTool = [
      'serialNumber',
      'barcode',
      'status',
      'modelNumber',
      'toolID',
    ]
    return searchesReturningOneTool.includes(searchBy)
  }
  
/**
 * Generates a unique identifier for a given tool document
 * @param {object} toolDocument - The document containing tool information
 * @returns An unique identifier based on the tool's ID, barcode, or serial number
 */
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
      return 'Unable to uniquely identify this tool' // Added return statement
    } catch (error) {
      return 'Unable to uniquely identify this tool'
    }
  }
  
  /**
   * Calculates the distance from today for a given date.
   * @param {Date} date - The date to calculate the distance from today.
   * @returns {string} - The distance from today in human-readable format.
   */
const hbsDate_distanceFromToday = (date) => {
    return moment(date).fromNow()
  }
  const customHelpers = {isSelected,
    getCategoryName,
    getServiceAssignmentJobNumber,
    paginate,
    returnUniqueIdentifier,
    getPackageVersion,
    searchingForOneTool,
    hbsDate_distanceFromToday,
    ...handlebarsHelpers()}

    
    export default customHelpers