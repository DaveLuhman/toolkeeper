import CategorySchema from './Category.schema'
import TenantSchema from './Tenant.schema'
import MaterialSchema from './Material.schema'
import ServiceAssignmentSchema from './ServiceAssignment.schema'
import ToolSchema from './Tool.schema'
import ToolHistorySchema from './ToolHistory.schema'
import UserSchema from './User.schema'
import { selectGlobalDatabase, selectTenantDatabase } from '../config/db'

async function createTenantModels(tenantId) {
  const tenantConnection = await selectTenantDatabase(tenantId)
  return {
    Category: tenantConnection.model('category', CategorySchema),
    Material: tenantConnection.model('material', MaterialSchema),
    ServiceAssignment: tenantConnection.model('serviceAssignment', ServiceAssignmentSchema),
    Tool: tenantConnection.model('tool', ToolSchema),
    ToolHistory: tenantConnection.model('toolHistory', ToolHistorySchema),
  }
}
export const { Category, Material, ServiceAssignment, Tool, ToolHistory } = createTenantModels()

async function createGlobalModels() {
  const db = await selectGlobalDatabase()
  return {
    Tenant: db.model('Tenant', TenantSchema),
    User: db.model('User', UserSchema),
  }
}
export const { Tenant, User } = await createGlobalModels()
