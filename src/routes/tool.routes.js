import { Router } from 'express'
import {
  checkTools,
  getToolByID,
  archiveTool,
  createTool,
  searchTools,
  updateTool
} from '../middleware/tool.js'
export const toolRouter = Router()

// get tool by id
toolRouter.get('/:id', getToolByID, (_req, res) => {
  res.render('editTool')
})

// search for tools
toolRouter.post('/search', searchTools, (_req, res) => {
  res.render('dashboard')
})

// determine if tool is checked in or out
toolRouter.post('/checkTools', checkTools, (_req, res) => {
  res.render('editTool')
})

// create new tool
toolRouter.post('/submit', createTool, (_req, res) => {
  res.render('dashboard')
})

// update tool
toolRouter.post('/update', updateTool, (_req, res) => {
  res.render('dashboard')
})

// archive tool
toolRouter.get('/archive/:id', archiveTool, (_req, res) => {
  res.redirect('/dashboard')
})
