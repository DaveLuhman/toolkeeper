import e from 'express'
import ServiceAssignment from '../models/ServiceAssignment.model.js'
import Tool from '../models/Tool.model.js'
import ToolHistory from '../models/ToolHistory.model.js'
import { deduplicateArray, mutateToArray, paginate, returnUniqueIdentifier } from './util.js'
import sortArray from 'sort-array'
import logger from '../config/logger.js'

/**
 *
 * @param {array} res.locals.tools returns array of tools in response
 * @param {*} next
 * @returns {array}
 *
 * This function will return all tools in the database along with pagination data
 */
async function getAllTools(req, res, next) {
  const { sortField, sortOrder } = req.user.preferences
  logger.info('[MW] getAllTools-in'.bgBlue.white)
  const tools = await Tool.find({}).sort({ [sortField]: sortOrder })
  res.locals.tools = tools // array of tools
  logger.info('[MW] getAllTools-out'.bgWhite.blue)
  return next()
}
/**
 *

 * @param {array} res.locals.tools returns array of tools in response
 * @param {*} next
 * @returns {array}
 *
 * This function will return all tools in the database along with pagination data
 */
async function getActiveTools(req, res, next) {
  const { sortField, sortOrder } = req.user.preferences
  logger.info('[MW] getAllTools-in'.bgBlue.white)
  res.locals.tools = await Tool.find()
    .where('archived')
    .equals(false)
    .sort({ [sortField]: sortOrder })
  logger.info('[MW] getAllTools-out'.bgWhite.blue)
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
async function getToolByID(req, res, next) {
  const id = req.params.id
  logger.info(`[MW] searching id: ${id}`)
  const tools = await Tool.findById({ $eq: id })
  const toolHistory = await ToolHistory.findById({ $eq: id }).sort({
    updatedAt: 1,
  })
  res.locals.tools = [tools]
  if (toolHistory) {
    res.locals.toolHistory = sortArray(toolHistory.history, {
      by: 'updatedAt',
      order: 'desc',
    })
  }
  return next()
}

async function getCheckedInTools() {
  const tools = await Tool.find().where('archived').equals(false)
  const activeServiceAssignmentsDocs = await ServiceAssignment.find()
    .where('type')
    .equals('Stockroom')
  const activeServiceAssignmentArray = activeServiceAssignmentsDocs.map(
    (item) => {
      return item._id.valueOf()
    }
  )
  const checkedInTools = []
  for (let i = 0; i < tools.length; i++) {
    for (let ii = 0; ii < activeServiceAssignmentArray.length; ii++) {
      if (activeServiceAssignmentArray[ii] == tools[i].serviceAssignment?._id) {
        checkedInTools.push(tools[i])
      }
    }
  }
  return checkedInTools
}
async function getCheckedOutTools() {
  const tools = await Tool.find().where('archived').equals(false)
  const activeServiceAssignmentsDocs = await ServiceAssignment.find()
    .where('type')
    .ne('Stockroom')
  const activeServiceAssignmentArray = activeServiceAssignmentsDocs.map(
    (item) => {
      return item._id.valueOf()
    }
  )
  const checkedInTools = []
  for (let i = 0; i < tools.length; i++) {
    for (let ii = 0; ii < activeServiceAssignmentArray.length; ii++) {
      if (activeServiceAssignmentArray[ii] == tools[i].serviceAssignment?._id) {
        checkedInTools.push(tools[i])
      }
    }
  }
  return checkedInTools
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
async function searchTools(req, res, next) {
  logger.info('[MW] searchTools-in'.bgBlue.white)
  const { sortField, sortOrder } = req.user.preferences
  const { searchBy, searchTerm } = req.body
  let tools
  switch (searchBy) {
    case 'Search By':
      res.locals.message = 'You must specify search parameters'
      return next()
    case 'serviceAssignment':
      res.locals.searchBy = searchBy
      res.locals.searchTerm = searchTerm
      res.locals.tools = await Tool.where('serviceAssignment')
        .equals(searchTerm)
        .sort({ [sortField]: sortOrder })
        .exec()
      break
    case 'category':
      res.locals.searchBy = searchBy
      res.locals.searchTerm = searchTerm
      res.locals.tools = await Tool.where('category')
        .equals(searchTerm)
        .sort({ [sortField]: sortOrder })
        .exec()
      break
    case 'status':
      res.locals.searchBy = searchBy
      res.locals.searchTerm = searchTerm
      if (searchTerm === 'Checked In')
        res.locals.tools = await getCheckedInTools()
      else res.locals.tools = await getCheckedOutTools()
      break
    default:
      res.locals.searchTerm = searchTerm
      res.locals.searchBy = searchBy
      res.locals.tools = await Tool.find({
        [searchBy]: { $eq: searchTerm },
      }).sort({ [sortField]: sortOrder })
      break
  }
  res.locals.totalFound = res.locals.tools.length
  logger.info('[MW] searchTools-out'.bgWhite.blue)
  return next()
}

/**
 *
 * @param {object} req.body The tool object to create
 * @param {string} res.locals.message The message to display to the user
 * @param {*} next
 * @returns
 */
async function createTool(req, res, next) {
  try {
    logger.info('[MW] createTool-in'.bgBlue.white)
    const {
      serialNumber,
      modelNumber,
      barcode,
      description,
      toolID,
      serviceAssignment,
      category,
      manufacturer,
      width,
      height,
      length,
      weight,
    } = req.body
    if (!(serialNumber || modelNumber) || !barcode) {
      throw new Error({ message: 'Missing required fields', status: 400 })
    }
    const existing = await Tool.findOne({
      $or: [{ serialNumber }, { barcode }],
    })
    if (existing) {
      res.locals.tools = mutateToArray(existing)
      throw new Error({ message: 'Tool already exists', status: 400 })
    }
    // TODO: verify input data is sanitized
    const newTool = await Tool.create({
      serialNumber,
      modelNumber,
      barcode,
      description,
      toolID,
      serviceAssignment,
      category,
      manufacturer,
      size: {
        height,
        width,
        length,
        weight,
      },
      updatedBy: req.user._id,
      createdBy: req.user._id,
    })
    if (!newTool) {
      throw new Error({ message: 'Could not create tool', status: 500 })
    }
    await ToolHistory.create({
      _id: newTool._id,
      history: [newTool],
    })
    res.locals.message = 'Successfully Made A New Tool'
    res.locals.tools = [newTool]
    res.locals.pagination = { pageCount: 1 }
    res.status(201)
    logger.info(`[MW] Tool Successfully Created ${newTool._id}`.green)
    logger.info('[MW] createTool-out-3'.bgWhite.blue)
    next()
  } catch (error) {
    res.locals.message = error.message
    res.status(error.status || 500).redirect('back')
  }
}

async function updateToolHistory(toolID) {
  const oldTool = await Tool.findById(toolID)
  await ToolHistory.findByIdAndUpdate(
    { _id: toolID },
    {
      $push: { history: oldTool },
      $inc: { __v: 1 },
      $set: { updatedAt: Date.now() },
    }
  )
}

/**
 *
 * @param {*} req.body._id The id of the tool to update
 * @param {*} res
 * @param {*} next
 */
async function updateTool(req, res, next) {
  logger.info('[MW] updateTool-in'.bgBlue.white)

  if (
    !req.body.serviceAssignment ||
    req.body.serviceAssignment == 'null' ||
    req.body.serviceAssignment == undefined
  ) {
    req.body.serviceAssignment = '64a34b651288871770df1086'
  }
  if (
    !req.body.category ||
    req.body.category == 'null' ||
    req.body.category == undefined
  ) {
    req.body.category = '64a1c3d8d71e121dfd39b7ab'
  }
  // block level function to update a single tool
  const {
    id,
    modelNumber,
    description,
    toolID,
    serviceAssignment,
    category,
    manufacturer,
    width,
    height,
    length,
    weight,
  } = req.body
  const updatedTool = await Tool.findByIdAndUpdate(
    { $eq: id },
    {
      modelNumber,
      description,
      toolID,
      serviceAssignment: serviceAssignment,
      category: category,
      manufacturer,
      size: {
        width,
        height,
        length,
        weight,
      },
      $inc: { __v: 1 },
      $set: { updatedAt: Date.now() },
    },
    { new: true }
  )

  const updatedToolArray = []
  // if (typeof req.body.id === 'string') {
  updateToolHistory(id) // Update the tools history
  updatedToolArray.push(updatedTool)
  // }
  // if (Array.isArray(req.body._id) && req.body._id.length > 0) {
  //   for (let i = 0; i < req.body.id.length > 100; i++) {
  //     const updatedTool = await ut({
  //       _id: req.body.id[i],
  //       modelNumber: req.body.modelNumber[i],
  //       description: req.body.description[i],
  //       toolID: req.body.toolID[i],
  //       serviceAssignment: req.body.serviceAssignment[i],
  //       category: req.body.category[i],
  //       manufacturer: req.body.manufacturer[i],
  //       size: {
  //         width: req.body.size.width[i],
  //         height: req.body.size.height[i],
  //         length: req.body.size.length[i],
  //         weight: req.body.size.weight[i]
  //       },
  //       $inc: { __v: 1 },
  //       $set: { updatedAt: Date.now() }
  //     })
  //     updatedToolArray.push(updatedTool)
  //   }
  // }
  res.locals.tools = updatedToolArray
  res.status(200)
  logger.info('[MW] Successfully Updated Tools: '.green + updatedToolArray)
  logger.info('[MW] updateTool-out-1'.bgWhite.blue)
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
async function archiveTool(req, res, next) {
  logger.info('[MW] archiveTool-in'.bgBlue.white)
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
  res.locals.message = 'Successfully Archived Tool ' + archivedTool.toolID
  res.locals.tools = mutateToArray(archivedTool)
  res.status(201)
  next()
}

async function unarchiveTool(req, res, next) {
  logger.info('[MW] archiveTool-in'.bgBlue.white)
  const { id } = req.params
  const unarchivedTool = await Tool.findByIdAndUpdate(
    { _id: id },
    { archived: false },
    { new: true }
  )
  await ToolHistory.findByIdAndUpdate(
    { _id: id },
    { $push: { history: [unarchivedTool] } },
    { new: true }
  )
  res.locals.message = 'Successfully Restored Tool ' + returnUniqueIdentifier(unarchivedTool)
  res.locals.tools = mutateToArray(unarchivedTool)
  res.status(201)
  next()
}
async function checkTools(req, res, next) {
  if (!req.body.searchTerms) {
    res.locals.message = 'No Tools Submitted For Status Change'
    logger.warn('[MW checkTools-out-1'.bgWhite.blue)
    res.status(400).redirect('back')
    return next()
  }
  const search = deduplicateArray(req.body.searchTerms.split(/\r?\n/))
  const toolsToBeChanged = await lookupToolWrapper(search)
  if (toolsToBeChanged.length === 0) {
    res.locals.message = 'No Tools Found Matching '
  }
  res.locals.target =
    req.body.serviceAssignmentInput === ''
      ? req.body.serviceAssignmentSelector
      : req.body.serviceAssignmentInput
  res.locals.tools = toolsToBeChanged
  next()
}
/**
 *
 * @param {string} searchTerm search target
 * @param {string} searchField optional, key to search - if not provided, will search all fields
 * @returns {object}
 */
async function lookupTool(searchTerm) {
  searchTerm = searchTerm.toUpperCase()
  let result = await Tool.findOne({ serialNumber: { $eq: searchTerm } })
  if (!result) {
    result = await Tool.findOne({ barcode: { $eq: searchTerm } })
  }
  if (!result) {
    result = await Tool.findOne({ toolID: { $eq: searchTerm } })
  }
  if (!result) {
    result = {}
  }
  logger.log(result)
  return result
}
/**
 * @name lookupToolWrapper
 * @desc iterator for looking up multiple search terms for checkTools
 * @param {*} searchTerms
 * @return {*} array of tools, with dummy objects if nothing is found
 */
async function lookupToolWrapper(searchTerms) {
  const tools = []
  for (let i = 0; i < searchTerms.length; i++) {
    const result = await lookupTool(searchTerms[i])
    logger.log(result)
    if (result?.serialNumber === undefined) {
      tools.push({
        serialNumber: searchTerms[i],
      })
    } else tools.push(result)
  }
  return tools
}

async function submitCheckInOut(req, res, next) {
  const id = mutateToArray(req.body.id)
  const newServiceAssignment = mutateToArray(req.body.newServiceAssignment)
  const newTools = []
  for (let i = 0; i < id.length; i++) {
    if (id[i] === 'toolNotFound') break
    updateToolHistory(id[i])
    newTools.push(
      await Tool.findByIdAndUpdate(
        { _id: id[i] },
        {
          serviceAssignment: newServiceAssignment[i],
          $inc: { __v: 1 },
          $set: { updatedAt: Date.now() },
        },
        { new: true }
      )
    )
  }
  res.locals.tools = newTools
  res.locals.message = `${newTools.length} tool(s) have been updated`
  next()
}

const generatePrinterFriendlyToolList = async (req, res, next) => {
  try {
    if (!res.locals.tools) return next()
    const { tools } = res.locals
    const printerFriendlyToolArray = await tools.map((tool) => {
      const { serialNumber, modelNumber, toolID, barcode, description } = tool
      return {
        serialNumber,
        modelNumber,
        toolID,
        barcode,
        description,
      }
    })
    if (printerFriendlyToolArray?.length === 0)
      throw new Error('There was a problem creating the printer friendly data')
    res.locals.printerFriendlyTools = printerFriendlyToolArray || []
    return next()
  } catch (err) {
    res.locals.message = err.message
    res.locals.printerFriendlyTools = []
    return next()
  }
}

export {
  getAllTools,
  getActiveTools,
  getToolByID,
  searchTools,
  createTool,
  updateTool,
  archiveTool,
  unarchiveTool,
  checkTools,
  submitCheckInOut,
  generatePrinterFriendlyToolList,
}
