import mongoose from 'mongoose'
import { createGlobalModels, createTenantModels } from '../models/index.models.js'
import TenantSchema from '../models/Tenant.schema.js'
import UserSchema from '../models/User.schema.js'


/**
 * Creates a default user with admin privileges.
 * @returns {Promise<Object>} A promise that resolves with the newly created user object.
 */
async function createDefaultUser() {
  try {
    const user = await mongoose.connections[0].model('User', UserSchema).
      create({
        _id: '663870c0a1a9cdb4b707c737',
        firstName: 'Admin',
        lastName: 'User',
        password: '$2b$10$cDCSqQ17sAbWloBElfevMO9NmjORalQP/1VJ7WY6BwvB7PsuNM./m',
        role: 'Admin',
        email: 'admin@toolkeeper.site',
        tenant: '66af881237c17b64394a4166'
      })
    return user
  } catch (error) {
    console.log(error)
  }
}
//
/**
 * Creates and returns a default category object for uncategorized tools.
 * @returns {Object} The newly created category object with preset values.
 */
function createDefaultCategory() {
  return Category.create({
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
function createDefaultServiceAssignments() {
  const serviceAssignments = [
    {
      _id: '64a19e910e675938ebb67de7',
      name: 'IMPORT',
      description: 'Imported',
      type: 'Imported - Uncategorized',
      phone: '',
      notes: 'Default SA for imported tools',
      active: true,
    },
    {
      _id: '64a34b651288871770df1086',
      name: 'DEPOT',
      description: 'Default stockroom for serialized tools',
      type: 'Stockroom',
      active: true,
    },
    {
      _id: '64a34b651288871770df1087',
      name: 'PARTS',
      description: 'Default stockroom for consumables/parts',
      type: 'Stockroom',
      active: true,
    },
  ]
  return ServiceAssignment.create(serviceAssignments)
}

/**
 * Creates a default tenant in the database.
 * @returns {Promise} A promise that resolves when the default tenant is created.
 */
async function createDefaultTenant() {
  try {

    const tenant = await mongoose.connections[0].model('Tenant', TenantSchema)
      .create({
        _id: '66af881237c17b64394a4166',
        name: 'demo',
        domain: 'toolkeeper.site',
        adminUser: '663870c0a1a9cdb4b707c737',
        subscriptionTier: 'Pro',
        subscriptionStatus: 'Active',
      })
    return tenant
  } catch (error) {
    console.log(error)
    throw error
  }
}

/**
 * Initializes the application's database with default documents.
 * This includes creating default category, and service assignment documents.
 * @returns {Promise} A promise that resolves when all default documents have been created successfully.
 */
function createDefaultDocuments() {
  const defaultPromises = [
    createDefaultCategory(),
    createDefaultServiceAssignments(),
  ]
  return Promise.allSettled(defaultPromises)
}
/**
 * Initializes the application's global database with default documents.
 * This includes creating default user and tenant documents.
 * @returns {Promise} A promise that resolves when all default documents have been created successfully.
 */
async function createDefaultGlobalDocuments() {
  const defaultGlobalPromises = [createDefaultUser(), createDefaultTenant()]
  return Promise.allSettled(defaultGlobalPromises)
}

/**
 * Initializes a tenant database with default settings.
 * This function is called when  no users including the default admin user are found in the database.
 * It logs a warning and creates a demo tenant database with default categories, and service assignments.
 * Only the admin user will be able to select the demo tenant database.
 * @returns {Promise} A promise that resolves when the database is successfully initialized.
 */
async function initializeDemoTenantDatabase() {
  console.warn(
    'Initializing Database, with tenant named "demo".\nDefault service assignments and categories will be created.'.red.underline
  );
  const tenantDb = await mongoose.connection.useDb('tenant_demo');
  console.log(tenantDb.db.databaseName)
  tenantDb.on('connected', () => {
    console.info('Connected to tenant_demo database');
    createDefaultDocuments();
  });

  tenantDb.on('error', (error) => {
    console.error(`Error connecting to tenant_demo database: ${error}`);
  });
}


/**
 * Selects the tenant database based on the provided tenant ID.
*
* @param {string} tenantId - The ID of the tenant.
* @returns {Promise<mongoose.Connection>} - A promise that resolves to the selected tenant database connection.
*/
export async function selectTenantDatabase(tenantName) {
  const globalDb = await selectGlobalDatabase();
  try {
    const Tenant = globalDb.model('Tenant', TenantSchema);
    const tenant = await Tenant.findOne({ 'name': { $eq: tenantName } });
    if (tenant) {
      console.log(`Found tenant: ${JSON.stringify(tenant)}`);
      return await mongoose.connection.useDb(`tenant_${tenant._id}`, { useCache: true });
    } else {
      throw new Error(`Tenant with name "${tenantName}" not found.`);
    }
  } catch (err) {
    console.error(`Error selecting tenant database: ${err.message}`);
    throw err;
  }
}
/**
 * Selects the global database using the mongoose connection.
 * @returns {Promise<mongoose.Connection>} The connection to the global database.
*/
export async function selectGlobalDatabase() {
  return await mongoose.connection.useDb('global', {
    useCache: true,
  })
}
/**
 * Establishes a connection to the MongoDB database using the MONGO_URI environment variable.
 * @returns {Promise} A promise that resolves when the connection is successfully established.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI).asPromise()
    const { User } = await createGlobalModels()
    console.info(
      `[DB INIT] MongoDB Connected: ${conn.host} ${conn.db.databaseName}`.cyan.underline.bold
    );
    const arethereusers = await User.find()
    if (await User.countDocuments() === 0) {
      console.log('No users exist in the currently selected database')
      createDefaultGlobalDocuments().then(async () => { await initializeDemoTenantDatabase() })

    }
  } catch (err) {
    console.error('DB INIT ERROR' + err);
    process.exit(1);
  }
  mongoose.ObjectId.get((v) => v.toString());
};
export default connectDB
