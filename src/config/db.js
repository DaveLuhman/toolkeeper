import mongoose from 'mongoose'
import User from '../models/User.model.js'
import Category from '../models/Category.model.js'
import ServiceAssignment from '../models/ServiceAssignment.model.js'

function isUsersCollectionEmpty () {
  const user = User.find()
  return user.length > 0
}

async function createDefaultUser () {
  try {
    return new User({
      firstName: 'Admin',
      lastName: 'User',
      password: '$2b$10$cDCSqQ17sAbWloBElfevMO9NmjORalQP/1VJ7WY6BwvB7PsuNM./m',
      role: 'Admin',
      email: 'admin@toolkeeper'
    })
  } catch (error) {
    console.log(error)
  }
}

async function createDefaultCategory () {
  const category = new Category({
    _id: '64a1c3d8d71e121dfd39b7ab',
    prefix: 'UC',
    name: 'Uncategorized',
    description: 'For Tools that dont have a home'
  })
  return await category.save()
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
  const defaultPromises = [
    createDefaultUser(),
    createDefaultCategory(),
    createDefaultServiceAssignments()
  ]
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
