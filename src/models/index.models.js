import CategorySchema from './Category.schema.js'
import TenantSchema from './Tenant.schema.js'
import MaterialSchema from './Material.schema.js'
import ServiceAssignmentSchema from './ServiceAssignment.schema.js'
import ToolSchema from './Tool.schema.js'
import UserSchema from './User.schema.js'
import SubscriptionSchema from './Subscription.schema.js'
import ProspectSchema from './Prospect.schema.js'
import OnboardingSchema from './Onboarding.schema.js'
import { model } from 'mongoose'
import logSchema from './Log.schema.js'

export const Category = model('Category', CategorySchema)
export const Subscription = model('Subscription', SubscriptionSchema)
export const Tenant = model('Tenant', TenantSchema)
export const Material = model('Material', MaterialSchema)
export const ServiceAssignment = model('ServiceAssignment', ServiceAssignmentSchema)
export const Tool = model('Tool', ToolSchema)
export const User = model('User', UserSchema)
export const Prospect = model('Prospect', ProspectSchema)
export const Log = model('Log', logSchema);
export const Onboarding = model('Onboarding', OnboardingSchema)

const models = {Category, Tenant, Material, ServiceAssignment, Tool, User, Subscription, Prospect, Log, Onboarding}
export default models


// src\models\index.models.js

