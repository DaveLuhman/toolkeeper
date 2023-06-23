import { Router } from 'express'
import {
  checkTools,
  getToolByID,
  archiveTool,
  createTool,
  searchTools,
  updateTool,
  submitCheckInOut
} from '../middleware/tool.js'
import { sanitizeReqBody } from '../middleware/util.js'
export const toolRouter = Router()

// get tool by id
toolRouter.get('/:id', getToolByID, (_req, res) => {
  res.render('editTool')
})

// search for tools
toolRouter.post('/search', sanitizeReqBody, searchTools, (_req, res) => {
  res.render('dashboard')
})

// determine if tool is checked in or out
toolRouter.post('/checkInOut', checkTools, (_req, res) => {
  res.render('checkInOut')
})
// determine if tool is checked in or out
toolRouter.post('/submitCheckInOut', submitCheckInOut, (_req, res) => {
  res.render('dashboard')
})

// create new tool
toolRouter.post('/submit', sanitizeReqBody, createTool, (_req, res) => {
  res.render('dashboard')
})

// update tool
toolRouter.post('/update', sanitizeReqBody, updateTool, (_req, res) => {
  res.render('dashboard')
})

// archive tool
toolRouter.get('/archive/:id', archiveTool, (_req, res) => {
  res.redirect('/dashboard')
})
