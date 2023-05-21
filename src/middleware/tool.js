import Tool from '../models/Tool.model.js'
import ToolHistory from '../models/ToolHistory.model.js'
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
  const { sortField, sortOrder } = req.user.preferences
  console.info('[MW] getAllTools-in'.bgBlue.white)
  const tools = await Tool.find({}).sort({ [sortField]: sortOrder })

  const { trimmedData, targetPage, pageCount } = paginate(
    tools,
    req.query.p || 1,
    req.user.preferences.pageSize
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
  const toolHistory = await ToolHistory.findById({ $eq: id })
  res.locals.tools = [tools]
  console.log(toolHistory)
  res.locals.toolHistory = toolHistory.history
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
  const { sortField, sortOrder } = req.user.preferences
  const { searchBy, searchValue } = req.body
  const tools = await Tool.find({
    [searchBy]: { $eq: searchValue }
  }).sort({ [sortField]: sortOrder })
  const { trimmedData, pageCount, targetPage } = paginate(
    tools,
    req.query.p,
    req.user.preferences.pageSize
  )
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
  try {
    console.info('[MW] createTool-in'.bgBlue.white)
    const {
      serialNumber,
      partNumber,
      barcode,
      description,
      serviceAssignment,
      category,
      manufacturer,
      width,
      height,
      length,
      weight
    } = req.body
    if (!(serialNumber || partNumber) || !barcode) {
      throw new Error({ message: 'Missing required fields', status: 400 })
    }
    const existing = await Tool.findOne({
      $or: [{ serialNumber }, { barcode }]
    })
    if (existing) {
      res.locals.tools = mutateToArray(existing)
      throw new Error({ message: 'Tool already exists', status: 400 })
    }
    // TODO: verify input data is sanitized
    const newTool = await Tool.create({
      serialNumber,
      partNumber,
      barcode,
      description,
      serviceAssignment,
      category,
      manufacturer,
      size: {
        height,
        width,
        length,
        weight
      },
      updatedBy: req.user._id,
      createdBy: req.user._id
    })
    if (!newTool) {
      throw new Error({ message: 'Could not create tool', status: 500 })
    }
    await ToolHistory.create({
      _id: newTool._id,
      history: [newTool]
    })
    res.locals.message = 'Successfully Made A New Tool'
    res.locals.tools = [newTool]
    res.locals.pagination = { pageCount: 1 }
    res.status(201)
    console.info(`[MW] Tool Successfully Created ${newTool._id}`.green)
    console.info('[MW] createTool-out-3'.bgWhite.blue)
    next()
  } catch (error) {
    res.locals.message = error.message
    res.status(error.status || 500).redirect('back')
  }
}
/**
 *
 * @param {*} req.body._id The id of the tool to update
 * @param {*} res
 * @param {*} next
 */
async function updateTool (req, res, next) {
  console.info('[MW] updateTool-in'.bgBlue.white)
  const ut = async (newToolData) => {
    const {
      id,
      partNumber,
      description,
      serviceAssignment,
      category,
      manufacturer,
      width,
      height,
      length,
      weight
    } = newToolData
    const oldTool = await Tool.findById({ $eq: id })
    const updatedTool = await Tool.findByIdAndUpdate(
      { $eq: id },
      {
        partNumber,
        description,
        serviceAssignment,
        category,
        manufacturer,
        size: {
          width,
          height,
          length,
          weight
        },
        $inc: { __v: 1 }
      },
      { new: true }
    )
    await ToolHistory.findByIdAndUpdate(
      { $eq: id },
      {
        $push: { history: oldTool },
        $inc: { __v: 1 }
      },
      { new: true }
    )
    return updatedTool
  }
  const updatedToolArray = []
  if (typeof req.body.id === 'string') {
    console.table(req.body)
    const updatedTool = await ut(req.body)
    updatedToolArray.push(updatedTool)
  }
  if (Array.isArray(req.body._id) && req.body._id.length > 0) {
    for (let i = 0; i < req.body.id.length > 100; i++) {
      const updatedTool = await ut({
        _id: req.body.id[i],
        partNumber: req.body.partNumber[i],
        description: req.body.description[i],
        serviceAssignment: req.body.serviceAssignment[i],
        category: req.body.category[i],
        manufacturer: req.body.manufacturer[i],
        size: {
          width: req.body.size.width[i],
          height: req.body.size.height[i],
          length: req.body.size.length[i],
          weight: req.body.size.weight[i]
        }
      })
      updatedToolArray.push(updatedTool)
    }
  }
  res.locals.tools = updatedToolArray
  res.locals.pagination = { page: 1, pageCount: 1 }
  res.status(200)
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
  await ToolHistory.findByIdAndUpdate(
    { _id: id },
    { $push: { history: [archivedTool] } },
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
        category: tempTool.category
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
        serviceAssignment: 'Tool Room',
        serviceAssignmentChanged: false,
        category: tempTool.category
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
    query = await Tool.findOne({ $text: { $search: searchTerm } })
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
