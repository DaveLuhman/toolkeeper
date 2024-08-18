import CategorySchema from './Category.schema.js'
import TenantSchema from './Tenant.schema.js'
import MaterialSchema from './Material.schema.js'
import ServiceAssignmentSchema from './ServiceAssignment.schema.js'
import ToolSchema from './Tool.schema.js'
import ToolHistorySchema from './ToolHistory.schema.js'
import UserSchema from './User.schema.js'
import { selectGlobalDatabase, selectTenantDatabase } from '../config/db.js'

export async function createTenantModels(tenantId) {
  const tenantConnection = await selectTenantDatabase(tenantId)
  return {
    Category: tenantConnection.model('category', CategorySchema),
    Material: tenantConnection.model('material', MaterialSchema),
    ServiceAssignment: tenantConnection.model('serviceAssignment', ServiceAssignmentSchema),
    Tool: tenantConnection.model('tool', ToolSchema),
    ToolHistory: tenantConnection.model('toolHistory', ToolHistorySchema),
  }
}



