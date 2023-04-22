
import { getAllTools } from '../middleware/tool.js'
import { Router } from 'express'
export const dashboardRouter = Router()
dashboardRouter.get('/', getAllTools, (req, res) => {
  res.render('dashboard')
})
