import { renderDashboard } from '../controllers/tool.js'
import { generatePrinterFriendlyToolList, getRecentlyUpdatedTools } from '../middleware/tool.js'
import {initCachedContent} from '../middleware/util.js'
import { Router } from 'express'
export const dashboardRouter = Router()
dashboardRouter.get(
  '/',
  initCachedContent,
  getRecentlyUpdatedTools,
  generatePrinterFriendlyToolList,
  renderDashboard
)

// src\routes\dashboard.routes.js
