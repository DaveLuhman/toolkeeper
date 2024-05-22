import { Router } from 'express'
import {
  checkTools,
  getToolByID,
  archiveTool,
  createTool,
  searchTools,
  updateTool,
  submitCheckInOut,
  generatePrinterFriendlyToolList
} from '../middleware/tool.js'
import { sanitizeReqBody, hoistSearchParamsToBody } from '../middleware/util.js'
import { listAllSAs } from '../middleware/serviceAssignment.js'
export const toolRouter = Router()

// search for tools and render the results with the dashboard view
toolRouter.use('/search', sanitizeReqBody, hoistSearchParamsToBody, listAllSAs, searchTools, generatePrinterFriendlyToolList, (req, res) => {
  res.render('results')
})
// TODO figure out where search paramaters require hoisting and either make it a global convention or fix it so it's not required.

// retrieve current service assignment and render checkInOut prompting user to select the new assignment
toolRouter.post('/checkInOut', checkTools, (_req, res) => {
  res.render('checkInOut')
})
// save the new service assignement to the database.
toolRouter.post('/submitCheckInOut', submitCheckInOut, (_req, res) => {
  res.render('results')
})

// create new tool
toolRouter.post('/submit', sanitizeReqBody, createTool, (_req, res) => {
  res.render('results')
})

// update tool
toolRouter.post('/update', sanitizeReqBody, updateTool, (_req, res) => {
  res.render('results')
})

// archive tool
toolRouter.get('/archive/:id', archiveTool, (_req, res) => {
  res.redirect('/dashboard')
})

// get tool by id
toolRouter.get('/:id', getToolByID, (_req, res) => {
  res.render('editTool')
})
