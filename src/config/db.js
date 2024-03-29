import mongoose from 'mongoose'
import User from '../models/User.model.js'
import Category from '../models/Category.model.js'
import ServiceAssignment from '../models/ServiceAssignment.model.js'

async function isUsersCollectionEmpty () {
  const user = await User.count()
  return user === 0
}

async function createDefaultUser () {
  try {
    const user = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      password: '$2b$10$cDCSqQ17sAbWloBElfevMO9NmjORalQP/1VJ7WY6BwvB7PsuNM./m',
      role: 'Admin',
      email: 'admin@toolkeeper'
    })
    return user
  } catch (error) {
    console.log(error)
  }
}

async function createDefaultCategory () {
  return await Category.create({
    _id: '64a1c3d8d71e121dfd39b7ab',
    prefix: 'UC',
    name: 'Uncategorized',
    description: 'For Tools that dont have a home'
  })
}

async function createDefaultServiceAssignments () {
  const serviceAssignments = [
    {
      _id: '64a19e910e675938ebb67de7',
      name: 'IMPORT',
      description: 'Imported',
      type: 'Imported - Uncategorized',
      phone: '',
      notes: 'Default SA for imported tools'
    },
    {
      _id: '64a34b651288871770df1086',
      name: 'DEPOT',
      description: 'Default stockroom for serialized tools',
      type: 'Stockroom'
    },
    {
      _id: '64a34b651288871770df1087',
      name: 'PARTS',
      description: 'Default stockroom for consumables/parts',
      type: 'Stockroom'
    }
  ]
  return await ServiceAssignment.create(serviceAssignments)
}

function createDefaultDocuments () {
  const defaultPromises = [
    createDefaultUser(),
    createDefaultCategory(),
    createDefaultServiceAssignments()
  ]
  return Promise.allSettled(defaultPromises)
}

function initializeDatabase () {
  console.warn('No Users In Database. Initializing Database.\nDefault User is admin@toolkeeper\nDefault password is "asdfasdf"'.red.underline)
  createDefaultDocuments()
}
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.info(
      `[DB INIT] MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold
    )
  } catch (err) {
    console.error('DB INIT' + err)
    process.exit(1)
  }
  if (await isUsersCollectionEmpty()) initializeDatabase()
  mongoose.ObjectId.get((v) => v.toString())
}
export default connectDB
