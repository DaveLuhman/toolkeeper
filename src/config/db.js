import mongoose from 'mongoose'
import User from '../models/User.model.js'
import Category from '../models/Category.model.js'
import ServiceAssignment from '../models/ServiceAssignment.model.js'
import logger from './logger.js'

/**
 * Checks if the users collection in the database is empty.
 * @returns {Promise<boolean>} A promise that resolves with true if the collection is empty, otherwise false.
 */
async function isUsersCollectionEmpty() {
  const user = await User.count()
  return user === 0
}

/**
 * Creates a default user with admin privileges.
 * @returns {Promise<Object>} A promise that resolves with the newly created user object.
 */
async function createDefaultUser() {
  try {
    const user = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      password: '$2b$10$cDCSqQ17sAbWloBElfevMO9NmjORalQP/1VJ7WY6BwvB7PsuNM./m',
      role: 'Admin',
      email: 'admin@toolkeeper.site'
    })
    return user
  } catch (error) {
    logger.log(error)
  }
}

/**
 * Creates and returns a default category object for uncategorized tools.
 * @returns {Object} The newly created category object with preset values.
 */
function createDefaultCategory() {
  return Category.create({
    _id: '64a1c3d8d71e121dfd39b7ab',
    prefix: 'UC',
    name: 'Uncategorized',
    description: 'For Tools that dont have a home'
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
      active: true
    },
    {
      _id: '64a34b651288871770df1086',
      name: 'DEPOT',
      description: 'Default stockroom for serialized tools',
      type: 'Stockroom',
      active: true
    },
    {
      _id: '64a34b651288871770df1087',
      name: 'PARTS',
      description: 'Default stockroom for consumables/parts',
      type: 'Stockroom',
      active: true
    }
  ]
  return ServiceAssignment.create(serviceAssignments)
}

/**
 * Initializes the application's database with default documents.
 * This includes creating default user, category, and service assignment documents.
 * @returns {Promise} A promise that resolves when all default documents have been created successfully.
 */
function createDefaultDocuments() {
  const defaultPromises = [
    createDefaultUser(),
    createDefaultCategory(),
    createDefaultServiceAssignments()
  ]
  return Promise.allSettled(defaultPromises)
}

/**
 * Initializes the database with default settings.
 * This function is called when no users are found in the database.
 * It logs a warning and creates default documents including a default user.
 */
function initializeDatabase() {
  logger.warn('No Users In Database. Initializing Database.\nDefault User is admin@toolkeeper.site\nDefault password is "asdfasdf"'.red.underline)
  createDefaultDocuments()
}
/** 
 * Establishes a connection to the MongoDB database using the MONGO_URI environment variable.
 * @returns {Promise} A promise that resolves when the connection is successfully established.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    logger.info(
      `[DB INIT] MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold
    )
  } catch (err) {
    logger.error('DB INIT' + err)
    // skipcq: JS-0263
    process.exit(1)
  }
  if (await isUsersCollectionEmpty()) initializeDatabase()
  mongoose.ObjectId.get((v) => v.toString())
}
export default connectDB
