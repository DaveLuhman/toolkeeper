import { renderDashboard } from '../controllers/tool.js'
import { generatePrinterFriendlyToolList, getRecentlyUpdatedTools } from '../middleware/tool.js'
import {initCachedContent} from '../middleware/util.js'
import { hoistOnboarding, dashboardOnboardingComplete, skipStep } from '../middleware/onboarding.js'
import { Router } from 'express'
export const dashboardRouter = Router()
dashboardRouter.get(
  '/',
  initCachedContent,
  getRecentlyUpdatedTools,
  generatePrinterFriendlyToolList,
  hoistOnboarding,
  renderDashboard
)
dashboardRouter.get('/skip-step/:step', skipStep, renderDashboard)
dashboardRouter.post('/onboarding-complete', dashboardOnboardingComplete)
// src\routes\dashboard.routes.js
