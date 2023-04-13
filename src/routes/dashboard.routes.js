
import { getAllTools } from '../middleware/tool.js'
import { Router } from 'express'
export const dashboardRouter = Router()
dashboardRouter.get('/', getAllTools, (_req, res) => {
  res.render('dashboard')
})
dashboardRouter.get('/test', getAllTools, (_req, res) => {
  res.render('test')
})
