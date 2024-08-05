import mongoose from 'mongoose'
import { globalModelsPromise, tenantModelsPromise } from '../models/index.models.js'
import logger from './logger.js'

const { User, Tenant } = await globalModelsPromise
const { Category, ServiceAssignment } = await tenantModelsPromise
/**
 * Checks if the users collection in the database is empty.
 * @returns {Promise<boolean>} A promise that resolves with true if the collection is empty, otherwise false.
 */
async function isUsersCollectionEmpty() {
  const user = await User.countDocuments()
  return user === 0
}

/**
 * Creates a default user with admin privileges.
 * @returns {Promise<Object>} A promise that resolves with the newly created user object.
 */
async function createDefaultUser() {
  try {
    const { User } = await globalModelsPromise
    const user = await User.create({
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
    logger.log(error)
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
    const tenant = await Tenant
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
    logger.log(error)
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
function createDefaultGlobalDocuments() {
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
  logger.warn(
    'Initializing Database, with tenant named "demo".\nDefault service assignments and categories will be created.'.red.underline
  );
  const tenantDb = await mongoose.connection.useDb('tenant_demo', {
    useCache: true,
  });

  tenantDb.on('connected', () => {
    console.info('Connected to tenant_demo database');
    createDefaultDocuments();
  });

  tenantDb.on('error', (error) => {
    console.error(`Error connecting to tenant_demo database: ${error}`);
  });
}
/**
 * Initializes the global database with a default admin user, and creates a demo tenant database.
 * This function is called when no users are found in the database.
 * It logs a warning, creates the global stuff, then initializes the demo tenant database, leaving it selected.
 */
function initializeDatabase() {
  logger.warn(
    'No Users In Database. Initializing Database.\nDefault User is admin@toolkeeper.site\nDefault password is "asdfasdf"'
      .red.underline
  )
  createDefaultGlobalDocuments()
  initializeDemoTenantDatabase()
}
/**
 * Establishes a connection to the MongoDB database using the MONGO_URI environment variable.
 * @returns {Promise} A promise that resolves when the connection is successfully established.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    logger.info(
      `[DB INIT] MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold
    );

    if (await isUsersCollectionEmpty()) {
      initializeDatabase();
    }
  } catch (err) {
    logger.error('DB INIT' + err);
    process.exit(1);
  }
  mongoose.ObjectId.get((v) => v.toString());
};

/**
 * Selects the tenant database based on the provided tenant ID.
 *
 * @param {string} tenantId - The ID of the tenant.
 * @returns {Promise<mongoose.Connection>} - A promise that resolves to the selected tenant database connection.
 */
export async function selectTenantDatabase(tenantName) {
  try {
    const globalDb = await selectGlobalDatabase();
    const Tenant = globalDb.model('Tenant') || globalDb.model('Tenant', TenantSchema);
    const tenant = await Tenant.findOne({ name: tenantName });
    
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
export default connectDB
