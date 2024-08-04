import { renderDashboard } from '../controllers/tool.js'
import { generatePrinterFriendlyToolList, getActiveTools } from '../middleware/tool.js'
import { Router } from 'express'
export const dashboardRouter = Router()
dashboardRouter.get(
  '/',
  getActiveTools,
  generatePrinterFriendlyToolList,
  renderDashboard
)
