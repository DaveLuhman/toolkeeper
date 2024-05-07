import Tool from '../models/Tool.model.js'
import ToolHistory from '../models/ToolHistory.model.js'
import { deduplicateArray, mutateToArray, paginate } from './util.js'
import sortArray from 'sort-array'

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
async function getAllTools(req, res, next) {
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
 *
 * @param {number} req.query.p page number
 * @param {object} res.locals.pagination {page: targetPage, pageCount: pageCount}
 * @param {array} res.locals.tools returns array of tools in response
 * @param {*} next
 * @returns {array}
 *
 * This function will return all tools in the database along with pagination data
 */
async function getActiveTools(req, res, next) {
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
async function getToolByID(req, res, next) {
  const id = req.params.id
  console.info(`[MW] searching id: ${id}`)
  const tools = await Tool.findById({ $eq: id })
  const toolHistory = await ToolHistory.findById({ $eq: id }).sort({
    updatedAt: 1
  })
  res.locals.tools = [tools]
  if (toolHistory) {
    res.locals.toolHistory = sortArray(toolHistory.history, {
      by: 'updatedAt',
      order: 'desc'
    })
  }
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
async function searchTools(req, res, next) {
  console.info('[MW] searchTools-in'.bgBlue.white)
  const { sortField, sortOrder } = req.user.preferences
  const { searchBy, searchTerm } = req.body
  let result
  console.table(req.body)
  switch (searchBy) {
    case 'Search By':
      res.locals.message = 'You must specify search parameters'
      return next()
    case 'serviceAssignment':
      res.locals.searchBy = searchBy
      res.locals.searchTerm = searchTerm
      result = await Tool.where('serviceAssignment')
        .equals(searchTerm)
        .sort({ [sortField]: sortOrder })
        .exec()
      break
    case 'category':
      res.locals.searchBy = searchBy
      res.locals.searchTerm = searchTerm
      result = await Tool.where('category')
        .equals(searchTerm)
        .sort({ [sortField]: sortOrder })
        .exec()
      break
    case 'status':
      res.locals.searchBy = searchBy
      res.locals.searchTerm = searchTerm
      result = await Tool.find({ serviceAssignment: { $eq: searchTerm } }).sort(
        { [sortField]: sortOrder }
      )
      break
    default:
      res.locals.searchTerm = searchTerm
      result = await Tool.find({
        [searchBy]: { $regex: searchTerm, $options: 'i' }
      }).sort({ [sortField]: sortOrder })
      break
  }
  console.log(result)
  const { trimmedData, pageCount, targetPage } = paginate(
    result,
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
async function createTool(req, res, next) {
  try {
    console.info('[MW] createTool-in'.bgBlue.white)
    const {
      serialNumber,
      modelNumber,
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
    if (!(serialNumber || modelNumber) || !barcode) {
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
      modelNumber,
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

async function updateToolHistory(toolID) {
  const oldTool = await Tool.findById(toolID)
  await ToolHistory.findByIdAndUpdate(
    { _id: toolID },
    {
      $push: { history: oldTool },
      $inc: { __v: 1 },
      $set: { updatedAt: Date.now() }
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
  console.info('[MW] updateTool-in'.bgBlue.white)
  const ut = async (newToolData) => {
    const {
      id,
      modelNumber,
      description,
      serviceAssignment,
      category,
      manufacturer,
      width,
      height,
      length,
      weight
    } = newToolData
    updateToolHistory(id)
    const updatedTool = await Tool.findByIdAndUpdate(
      { $eq: id },
      {
        modelNumber,
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
        $inc: { __v: 1 },
        $set: { updatedAt: Date.now() }
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
        modelNumber: req.body.modelNumber[i],
        description: req.body.description[i],
        serviceAssignment: req.body.serviceAssignment[i],
        category: req.body.category[i],
        manufacturer: req.body.manufacturer[i],
        size: {
          width: req.body.size.width[i],
          height: req.body.size.height[i],
          length: req.body.size.length[i],
          weight: req.body.size.weight[i]
        },
        $inc: { __v: 1 },
        $set: { updatedAt: Date.now() }
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
async function archiveTool(req, res, next) {
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

async function checkTools(req, res, next) {
  if (!req.body.searchTerms) {
    res.locals.message = 'No Tools Submitted For Status Change'
    console.warn('[MW checkTools-out-1'.bgWhite.blue)
    res.status(400).redirect('back')
    return next()
  }
  const search = deduplicateArray(req.body.searchTerms.split(/\r?\n/))
  const toolsToBeChanged = await lookupToolWrapper(search)
  if (toolsToBeChanged.length === 0) {
    res.locals.message = 'No Tools Found Matching '
  }
  res.locals.target = (req.body.serviceAssignmentInput === '') ? req.body.serviceAssignmentSelector : req.body.serviceAssignmentInput
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
  console.log(result)
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
    console.log(result)
    if (result?.serialNumber === undefined) {
      tools.push({
        serialNumber: searchTerms[i]
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
          $set: { updatedAt: Date.now() }
        },
        { new: true }
      )
    )
  }
  res.locals.tools = newTools
  res.locals.message = `${newTools.length} tool(s) have been updated`
  next()
}

export {
  getAllTools,
  getActiveTools,
  getToolByID,
  searchTools,
  createTool,
  updateTool,
  archiveTool,
  checkTools,
  submitCheckInOut
}
