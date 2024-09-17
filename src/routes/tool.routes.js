import { Router } from 'express'
import {
  checkTools,
  getToolByID,
  archiveTool,
  createTool,
  searchTools,
  updateTool,
  submitCheckInOut,
  generatePrinterFriendlyToolList,
  getAllTools,
  unarchiveTool,
} from '../middleware/tool.js'
import { sanitizeReqBody, hoistSearchParamsToBody } from '../middleware/util.js'
import { listAllSAs } from '../middleware/serviceAssignment.js'
import {
  renderEditTool,
  renderResults,
  renderStatusChangeConfirmationPage,
  renderBatchCreationPage,
  batchCreateTools
} from '../controllers/tool.js'
import { redirectToDashboard } from '../controllers/index.js'
export const toolRouter = Router()

// search for tools and render the results with the dashboard view
toolRouter.use(
  '/search',
  sanitizeReqBody,
  hoistSearchParamsToBody,
  listAllSAs,
  searchTools,
  generatePrinterFriendlyToolList,
  renderResults
)

// retrieve current service assignment and render checkInOut prompting user to select the new assignment
toolRouter.post('/checkInOut', listAllSAs, checkTools, renderStatusChangeConfirmationPage)

// save the tool's new service assignment to the database.
toolRouter.post('/submitCheckInOut', submitCheckInOut, renderResults)

// create new tool
toolRouter.post('/submit', sanitizeReqBody, createTool, redirectToDashboard)
// render batch creation page
toolRouter.get('/batchCreate', renderBatchCreationPage)
// validate and create a batch of submitted tools
toolRouter.post('/batchCreate', sanitizeReqBody, batchCreateTools)
// update tool
toolRouter.post('/update', sanitizeReqBody, updateTool, renderResults)

// archive tool
toolRouter.get('/archive/:id', archiveTool, getAllTools, renderResults)
// archive tool
toolRouter.get('/unarchive/:id', unarchiveTool, getAllTools, renderResults)

// get tool by id
toolRouter.get('/:id', getToolByID, renderEditTool)

// src\routes\tool.routes.js
