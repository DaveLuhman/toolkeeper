import Tool from '../models/Tool.model.js'
import { mutateToArray, paginate } from './util.js'

/**
 *
 * @param {number} req.query.p page number
 * @param {object} res.locals.pagination {page: targetPage, pageCount: pageCount}
 * @param {array} res.locals.tools returns array of tools in response
 * @param {*} next
 * @returns {array}
 *
 * This function will return all tools in the database along with pagination data
 */
async function getAllTools (req, res, next) {
  console.info('[MW] getAllTools-in'.bgBlue.white)
  const tools = await Tool.find({})
  tools.sort((a, b) => a.serialNumber - b.serialNumber)
  const { trimmedData, targetPage, pageCount } = paginate(
    tools,
    req.query.p || 1,
    10
  )
  res.locals.pagination = { page: targetPage, pageCount } // pagination
  res.locals.tools = trimmedData // array of tools
  console.info('[MW] getAllTools-out'.bgWhite.blue)
  return next()
}

/**
 * getToolByID
 * uses the id in the request to find a tool in the database, returning the tool in the response. It returns it in an array so handlebars can iterate over it despite there only being one tool.
 * @param {string} req.params.id Tool ID
 * @param {array} res.locals.tools returns array of tools in response
 * @param {*} next
 * @returns {array}
 */
async function getToolByID (req, res, next) {
  const id = req.params.id
  console.info(`[MW] searching id: ${id}`)
  const tools = await Tool.findById({ $eq: id })
  res.locals.tools = [tools]
  return next()
}
/**
 *
 * @param {string} req.body.searchBy The key to search by
 * @param {string} req.body.searchValue The terms to search for
 * @param {number} req.query.p Page Number
 * @param {object} res.locals.pagination {page: targetPage, pageCount: pageCount} pagination data
 * @param {array} res.locals.tools returns array of tools in response
 * @param {*} next
 * @returns {array}
 */
async function searchTools (req, res, next) {
  console.info('[MW] searchTools-in'.bgBlue.white)
  const { searchBy, searchValue } = req.body
  const tools = await Tool.find({
    [searchBy]: { $eq: searchValue }
  })
  tools.sort((a, b) => a.serialNumber - b.serialNumber)
  const { trimmedData, pageCount, targetPage } = paginate(tools, req.query.p, 10)
  res.locals.pagination = { page: targetPage, pageCount } // pagination
  res.locals.tools = trimmedData // array of tools
  console.info('[MW] searchTools-out'.bgWhite.blue)
  return next()
}
/**
 *
 * @param {object} req.body The tool object to create
 * @param {string} res.locals.message The message to display to the user
 * @param {*} next
 * @returns
 */
async function createTool (req, res, next) {
  console.info('[MW] createTool-in'.bgBlue.white)
  const {
    serialNumber,
    partNumber,
    barcode,
    description,
    serviceAssignment,
    status
  } = req.body
  if (!(serialNumber || partNumber) || !barcode) {
    res.locals.message =
      'Either Serial Num and Barcode or Part Num and Barcode required'
    console.error('[MW] createTool-out-1'.red)
    res.status(400).redirect('back')
    return
  }
  const existing = await Tool.findOne({
    $or: [{ serialNumber }, { barcode }]
  })
  if (existing) {
    res.locals.message = 'Tool already exists'
    res.locals.tools = mutateToArray(existing)
    console.error('[MW] createTool-out-2'.red)
    res.status(400).redirect('back')
    return next()
  }
  const newTool = await Tool.create({
    serialNumber,
    partNumber,
    barcode,
    description,
    serviceAssignment,
    status,
    updatedBy: req.user._id,
    createdBy: req.user._id
  })
  res.locals.message = 'Successfully Made A New Tool'
  res.locals.tools = [newTool]
  res.locals.pagination = { pageCount: 1 }
  res.status(201)
  console.info(`[MW] Tool Successfully Created ${newTool._id}`.green)
  console.info('[MW] createTool-out-3'.bgWhite.blue)
  next()
}

/**
 *
 * @param {*} req.body._id The id of the tool to update
 * @param {*} res
 * @param {*} next
 */
async function updateTool (req, res, next) {
  console.info('[MW] updateTool-in'.bgBlue.white)
  const updatedToolArray = []
  if (typeof req.body._id === 'string') {
    const { _id, partNumber, description, serviceAssignment, status } = req.body
    const updatedTool = await Tool.findByIdAndUpdate(
      _id,
      {
        partNumber,
        description,
        serviceAssignment,
        status
      },
      { new: true }
    ).exec()
    console.info(`updatedTool: ${updatedTool}`.green)
    updatedToolArray.push(updatedTool)
  }
  if (Array.isArray(req.body._id) && req.body._id.length > 1) {
    const { _id, partNumber, description, serviceAssignment, status } = req.body
    for (let i = 0; i < _id.length > 100; i++) {
      const updatedTool = await Tool.findByIdAndUpdate(
        _id[i],
        {
          partNumber: partNumber[i],
          description: description[i],
          serviceAssignment: serviceAssignment[i],
          status: status[i]
        },
        { new: true }
      ).exec()
      console.info(`updatedTool: ${updatedTool}`.green)
      updatedToolArray.push(updatedTool)
    }
  }
  res.locals.tools = updatedToolArray
  res.locals.pagination = { page: 1, pageCount: 1 }
  res.status(201)
  console.info('[MW] Successfully Updated Tools: '.green + updatedToolArray)
  console.info('[MW] updateTool-out-1'.bgWhite.blue)
  next()
}
/**
 * archiveTool - Archives a tool
 * @param {string} req.params.id The id of the tool to archive
 * @param {string} res.locals.message The message to display to the user
 * @param {array} res.locals.tools The tool that was archived
 * @param {number} res.status The status code to return
 * @param {*} next
 */
async function archiveTool (req, res, next) {
  console.info('[MW] archiveTool-in'.bgBlue.white)
  const { id } = req.params
  const archivedTool = await Tool.findByIdAndUpdate(
    { _id: id },
    { archived: true },
    { new: true }
  )
  res.locals.message = 'Successfully Marked Tool Archived'
  res.locals.tools = [archivedTool]
  res.status(201)
  console.info('[MW] archiveTool-out-1'.bgWhite.blue)
  next()
}

/**
 * checkTools - Checks whether tools are checked in/out and returns the inverse.
 * @param {string} req.body.searchTerm The serialNumber/barcode of the tool to archive
 * @param {string} res.locals.message The message to display to the user
 * @param {array} res.locals.tools The tool that was unarchived
 * @param {number} res.status The status code to return
 * @param {*} next
 * @returns
 */
async function checkTools (req, res, next) {
  console.info('[MW] checkTools-in'.bgBlue.white)
  console.log(JSON.stringify(req.body))
  if (req.body.searchTerm === '' || req.body.searchTerm === undefined) {
    res.locals.message = 'No Tools Submitted For Status Change'
    console.warn('[MW checkTools-out-1'.bgWhite.blue)
    res.status(400).redirect('back')
    return
  }
  const [searchTerm] = req.body
  const checkingTools = []
  for (let i = 0; i < searchTerm.length > 100; i++) {
    if (searchTerm[i] === '') {
      continue
    }
    const tempTool = lookupTool(searchTerm[i])
    if (tempTool.status === 'Checked In') {
      const pendingTool = {
        _id: tempTool._id,
        serialNumber: tempTool.serialNumber,
        partNumber: tempTool.partNumber,
        barcode: tempTool.barcode,
        description: tempTool.description,
        serviceAssignment: 'FILL THIS IN',
        serviceAssignmentChanged: true,
        status: 'Checked Out',
        statusChanged: true
      }
      checkingTools.push(pendingTool)
    }
    if (tempTool.status === 'Checked Out') {
      const pendingTool = {
        _id: tempTool._id,
        serialNumber: tempTool.serialNumber,
        partNumber: tempTool.partNumber,
        barcode: tempTool.barcode,
        description: tempTool.description,
        status: 'Checked In',
        statusChanged: true,
        serviceAssignment: 'Tool Room',
        serviceAssignmentChanged: false
      }
      checkingTools.push(pendingTool)
    }
  }
  if (!checkingTools || checkingTools.length === 0) {
    res.locals.message = 'Tools not found'
    res.locals.tools = []
    console.warn('[MW] Tools Not Found'.yellow)
    console.info('[MW] checkTools-out-2'.bgWhite.blue)
    res.status(400).redirect('back')
    return
  }
  res.locals.tools = checkingTools
  res.status(200)
  console.info('[MW] checkTools-out-3'.bgWhite.blue)
  next()
}
/**
 *
 * @param {string} searchTerm search target
 * @param {string} searchField optional, key to search - if not provided, will search all fields
 * @returns {object}
 */
async function lookupTool (searchTerm, searchField) {
  let query
  if (searchField === '' || searchField === undefined) {
    query = await Tool.findOne({ $text: { $search: searchTerm } }) // generic search
  }
  if (searchField) {
    query = await Tool.findOne({ [searchField]: { $eq: searchTerm } })
  }
  if (!query) {
    console.warn('[MW] Tool Not Found'.yellow)
    return
  }
  return mutateToArray(query)
}

export {
  getAllTools,
  getToolByID,
  searchTools,
  createTool,
  updateTool,
  archiveTool,
  checkTools
}
