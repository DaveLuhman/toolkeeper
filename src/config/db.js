import mongoose from 'mongoose';
import TenantSchema from '../models/Tenant.schema.js';
import UserSchema from '../models/User.schema.js';
import CategorySchema from '../models/Category.schema.js';
import ServiceAssignmentSchema from '../models/ServiceAssignment.schema.js';

// Initialize models using the global connection instance
let globalConn;
let User;
let Tenant;
async function connectDB() {
  try {
    globalConn = await mongoose.createConnection(process.env.MONGO_URI).asPromise();
    User = globalConn.model('User', UserSchema);
    Tenant = globalConn.model('Tenant', TenantSchema);

    console.info(`[DB INIT] MongoDB Connected: ${globalConn.host} ${globalConn.db.databaseName}`.cyan.underline.bold);

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('No users exist in the currently selected database');
      await createDefaultGlobalDocuments();
    }
  } catch (err) {
    console.error('DB INIT ERROR: ' + err);
    process.exit(1);
  }
}

async function createDefaultUser() {
  try {
    const user = await User.create({
      _id: '663870c0a1a9cdb4b707c737',
      firstName: 'Admin',
      lastName: 'User',
      password: '$2b$10$cDCSqQ17sAbWloBElfevMO9NmjORalQP/1VJ7WY6BwvB7PsuNM./m',
      role: 'Admin',
      email: 'admin@toolkeeper.site',
      tenant: '66af881237c17b64394a4166',
    });
    return user;
  } catch (error) {
    console.error(error);
  }
}

async function createDefaultTenant() {
  try {
    const tenant = await Tenant.create({
      _id: '66af881237c17b64394a4166',
      name: 'demo',
      domain: 'toolkeeper.site',
      adminUser: '663870c0a1a9cdb4b707c737',
      subscriptionTier: 'Pro',
      subscriptionStatus: 'Active',
    });
    return tenant;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
/**
 * Creates and returns a default category object for uncategorized tools.
 * @returns {Object} The newly created category object with preset values.
 */
function createDefaultCategory() {
  return globalConn.model('Category', CategorySchema).create({
    _id: '64a1c3d8d71e121dfd39b7ab',
    prefix: 'UC',
    name: 'Uncategorized',
    description: 'For Tools that dont have a category',
  })
}

/**
 * Asynchronously creates default service assignments used across the platform.
 * This function seeds the database with predefined service assignment records.
 * @returns {Promise} A promise that resolves when the service assignments are successfully created.
 */
async function createDefaultServiceAssignments() {

  const serviceAssignments = [
    {
      _id: '64a19e910e675938ebb67de7',
      name: 'IMPORT',
      description: 'Imported',
      type: 'Imported - Uncategorized',
      phone: '',
      notes: 'Default SA for imported tools',
      active: true,
      tenant: '66af881237c17b64394a4166',
    },
    {
      _id: '64a34b651288871770df1086',
      name: 'DEPOT',
      description: 'Default stockroom for serialized tools',
      type: 'Stockroom',
      active: true,
      tenant: '66af881237c17b64394a4166',
    },
    {
      _id: '64a34b651288871770df1087',
      name: 'PARTS',
      description: 'Default stockroom for consumables/parts',
      type: 'Stockroom',
      active: true,
      tenant: '66af881237c17b64394a4166',
    },
  ]
  return await globalConn.model('ServiceAssignment', ServiceAssignmentSchema).create(serviceAssignments)
}

function createDefaultDocuments() {
  const defaultPromises = [
    createDefaultCategory(),
    createDefaultServiceAssignments(),
  ];
  return Promise.allSettled(defaultPromises);
}

async function createDefaultGlobalDocuments() {
  const defaultGlobalPromises = [createDefaultUser(), createDefaultTenant()];
  return Promise.allSettled(defaultGlobalPromises);
}

export { connectDB, User, Tenant, globalConn };
