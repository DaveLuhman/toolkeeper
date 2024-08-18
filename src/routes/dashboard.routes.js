import { renderDashboard } from '../controllers/tool.js'
import { generatePrinterFriendlyToolList, getActiveTools } from '../middleware/tool.js'
import { Router } from 'express'
import { hoistTenantId } from '../middleware/util.js'
export const dashboardRouter = Router()
dashboardRouter.get(
  '/',
  hoistTenantId,
  getActiveTools,
  generatePrinterFriendlyToolList,
  renderDashboard
)
