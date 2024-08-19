import CategorySchema from './Category.schema.js'
import TenantSchema from './Tenant.schema.js'
import MaterialSchema from './Material.schema.js'
import ServiceAssignmentSchema from './ServiceAssignment.schema.js'
import ToolSchema from './Tool.schema.js'
import ToolHistorySchema from './ToolHistory.schema.js'
import UserSchema from './User.schema.js'
import { model } from 'mongoose'

export const Category = model('Category', CategorySchema)
export const Tenant = model('Tenant', TenantSchema)
export const Material = model('Material', MaterialSchema)
export const ServiceAssignment = model('ServiceAssignment', ServiceAssignmentSchema)
export const Tool = model('Tool', ToolSchema)
export const ToolHistory = model('ToolHistory', ToolHistorySchema)
export const User = model('User', UserSchema)

const models = {Category, Tenant, Material, ServiceAssignment, Tool, ToolHistory, User}
export default models

