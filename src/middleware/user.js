import User from '../models/User.model.js'
import bcrypt from 'bcrypt'

/**
 * getUsers - queries all users from db
 * @param {array} res.locals.users - if id is not provided, find all users
 * @param {*} next
 * @returns {array}
 */
async function getUsers (_req, res, next) {
  console.info('[MW] getUsers-in'.bgBlue.white)
  res.locals.users = await User.find()
  console.info('[MW] getUsers-out-2'.bgWhite.blue)
  next()
}
async function getUserByID (req, res, next) {
  console.info('[MW] getUserByID-in'.bgBlue.white)
  const id = req.params.id
  console.info(`[MW] searching id: ${id}`)
  const user = await User.findById({ $eq: id })
  res.locals.targetUser = [user]
  console.info('[MW] getUserByID-out'.bgWhite.blue)
  next()
}
async function createUser (req, res, next) {
  console.info('[MW] createUser-in'.bgBlue.white)
  const { firstName, lastName, email, password, confirmPassword, role } =
    req.body
  if (!email || !password) {
    res.locals.error = 'Email and Password are required'
    console.warn('Email and Password are both required'.yellow)
    console.info('[MW] createUser-out-1'.bgWhite.blue)
    res.redirect('back')
    return
  }
  if (await User.findOne({ email })) {
    res.locals.error = 'Email is already registered'
    console.warn('Email is already registered'.yellow)
    console.info('[MW] createUser-out-2'.bgWhite.blue)
    res.redirect('back')
    return
  }
  if (password !== confirmPassword) {
    res.locals.error = 'Passwords do not match'
    console.warn('Passwords do not match'.yellow)
    console.info('[MW] createUser-out-3'.bgWhite.blue)
    res.redirect('back')
    return
  }
  const hash = bcrypt.hashSync(password, 10)
  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password: hash,
    role
  })
  res.locals.user = [newUser]
  console.info(`Created User ${newUser._id}`.green)
  console.info('[MW] createUser-out-4'.bgWhite.blue)
  return next()
}
async function verifySelf (req, res, next) {
  console.info('[MW] verifySelf-in'.bgBlue.white)
  const targetID = req.params.id || req.body._id
  const currentUser = req.user._id
  if (targetID !== currentUser) {
    res.status(401)
    res.locals.error = 'Unauthorized'
    console.warn('Unauthorized'.yellow)
    console.info('[MW] verifySelf-out-0'.bgWhite.blue)
    res.redirect('back')
    return
  }
  console.info('[MW] verifySelf-out-1'.bgWhite.blue)
  return next()
}
async function updateUser (req, res, next) {
  const { firstName, lastName, email, theme, sortField, sortDirection, pageSize } = req.body
  console.table(req.body)
  console.info('[MW] updateUser-in'.bgBlue.white)
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        firstName,
        lastName,
        email,
        preferences: {
          theme,
          sortField,
          sortDirection,
          pageSize
        }
      }
    },
    { new: true }
  )
  console.log(user)
  res.locals.user = user
  req.login(user, (error) => { console.log('This is an error' + error) })
  console.info('[MW] updateUser-out'.bgWhite.blue)
  return next()
}

async function resetPassword (req, res, next) {
  console.info('[MW] resetPassword-in'.bgBlue.white)
  // get data from request body
  const { _id, password, confirmPassword } = req.body
  // if new password and confirm password are not set
  if (!password || !confirmPassword) {
    res.locals.error = 'New password and confirm password are required'
    console.info('[MW] resetPassword-out-1'.bgWhite.blue)
    res.status(400).redirect('back')
    return
  }
  // if new password and confirm password do not match
  if (password !== confirmPassword) {
    res.locals.error = 'New password and confirm password must match'
    console.info('[MW] resetPassword-out-2'.bgWhite.blue)
    res.status(400).redirect('back')
    return
  }
  const hash = bcrypt.hashSync(password, 10)
  await User.findByIdAndUpdate(_id, { $set: { password: hash } })
  console.info('[MW] resetPassword-out-4'.bgWhite.blue)
  return next()
}
async function disableUser (req, res, next) {
  console.info('[MW] disableUser-in'.bgBlue.white)
  await User.findByIdAndUpdate(req.params.id, { $set: { isDisabled: true } })
  console.info('[MW] disableUser-out'.bgBlue.white)
  return next()
}
export {
  resetPassword,
  getUsers,
  createUser,
  verifySelf,
  updateUser,
  disableUser,
  getUserByID
}
