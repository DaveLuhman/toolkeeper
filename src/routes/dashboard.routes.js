
import { getAllTools } from '../middleware/tool.js'
import { Router } from 'express'
export const dashboardRouter = Router()
dashboardRouter.get('/', getAllTools, (_req, res) => {
  res.render('dashboard')
})
