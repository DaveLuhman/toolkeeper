import { generatePrinterFriendlyToolList, getAllTools } from '../middleware/tool.js'
import { Router } from 'express'
export const dashboardRouter = Router()
dashboardRouter.get('/', getAllTools, generatePrinterFriendlyToolList, (_req, res) => {
  res.render('dashboard')
})
