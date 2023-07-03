import mongoose from 'mongoose'
import User from '../models/user'
import Category from '../models/Category.model'
import ServiceAssignment from '../models/ServiceAssignment.model'

function isUsersCollectionEmpty () {
  const user = User.find()
  return user.length > 0
}

async function createDefaultUser () {
  return new User({
    firstName: 'Admin',
    lastName: 'User',
    password: '$2b$10$cDCSqQ17sAbWloBElfevMO9NmjORalQP/1VJ7WY6BwvB7PsuNM./m',
    role: 'Admin',
    email: 'admin@toolkeeper'
  })
}

async function createDefaultCategory () {
 const category = new Category({
    id: '64a1c3d8d71e121dfd39b7ab',
    prefix: 'UC',
    name: 'Uncategorized',
    description: 'For Tools that dont have a home'
  })
  return await category.save()
}

async function createDefaultServiceAssignments () {
  const serviceAssignments = [
    {
      id: '64a19e910e675938ebb67de7',
      name: 'IMPORT',
      description: 'Imported',
      type: 'Imported - Uncategorized',
      phone: '',
      notes: 'Default SA for imported tools'
    },
    {
      name: 'DEPOT',
      description: 'Default stockroom for serialized tools',
      type: 'Stockroom'
    },
    {
      name: 'PARTS',
      description: 'Default stockroom for consumables/parts',
      type: 'Stockroom'
    }
  ]
  return await ServiceAssignment.create(serviceAssignments)
}

function createDefaultDocuments () {
  const defaultPromises = new Promise(
    createDefaultUser(),
    createDefaultCategory(),
    createDefaultServiceAssignments()
  )
  return Promise.allSettled(defaultPromises)
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
  if (!isUsersCollectionEmpty()) createDefaultDocuments()
  mongoose.ObjectId.get((v) => v.toString())
}
export default connectDB
