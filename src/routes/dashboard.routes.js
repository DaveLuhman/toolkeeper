import { renderDashboard } from '../controllers/tool.js'
import { generatePrinterFriendlyToolList, getActiveTools } from '../middleware/tool.js'
import {initCachedContent} from '../middleware/util.js'
import { Router } from 'express'
export const dashboardRouter = Router()
dashboardRouter.get(
  '/',
  initCachedContent,
  getActiveTools,
  generatePrinterFriendlyToolList,
  renderDashboard
)
