import User from '../models/User.schema.js'
import bcrypt from 'bcrypt'
import { mutateToArray } from './util.js'
import logger from '../config/logger.js'

/**
 * getUsers - queries all users from db
 * @param {array} res.locals.users - if id is not provided, find all users
 * @param {*} next
 * @returns {array}
 */
async function getUsers(_req, res, next) {
  logger.info('[MW] getUsers-in'.bgBlue.white)
  const users = await User.find()
  res.locals.users = mutateToArray(users)
  logger.info('[MW] getUsers-out-2'.bgWhite.blue)
  return next()
}
/**
 * Retrieves a user by their ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the user is retrieved.
 */
async function getUserByID(req, res, next) {
  logger.info('[MW] getUserByID-in'.bgBlue.white)
  const id = req.params.id
  logger.info(`[MW] searching id: ${id}`)
  const user = await User.findById(id)
  res.locals.targetUser = mutateToArray(user)
  logger.info('[MW] getUserByID-out'.bgWhite.blue)
  return next()
}
/**
 * Creates a new user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the user is created.
 */
async function createUser(req, res, next) {
  logger.info('[MW] createUser-in'.bgBlue.white)
  const { firstName, lastName, email, password, confirmPassword, role } =
    req.body
  if (!email || !password) {
    const error = 'Email and Password are required'
    logger.warn('Email and Password are both required'.yellow)
    logger.info('[MW] createUser-out-1'.bgWhite.blue)
    res.redirect('back')
    return next(error)
  }
  if (await User.findOne({ email })) {
    const error = 'Email is already registered'
    logger.warn('Email is already registered'.yellow)
    logger.info('[MW] createUser-out-2'.bgWhite.blue)
    res.redirect('back')
    return next(error)
  }
  if (password !== confirmPassword) {
    const error = 'Passwords do not match'
    logger.warn(
      'Passwords do not match  '.yellow
    )
    logger.info('[MW] createUser-out-3'.bgWhite.blue)
    res.redirect('back')
    return next(error)
  }
  const hash = bcrypt.hashSync(password, 10)
  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password: hash,
    role
  })
  newUser.save()
  logger.log(newUser)
  logger.info(`Created User ${newUser._id}`.green)
  logger.info('[MW] createUser-out-4'.bgWhite.blue)
  return next()
}
/**
 * Verifies if the current user is the same as the target user.
 * @param {object} req The request object.
 * @param {object} res The response object.
 * @param {function} next Callback function to pass control to the next middleware.
 */
function verifySelf(req, res, next) {
  logger.info('[MW] verifySelf-in'.bgBlue.white)
  const targetID = req.params.id || req.body._id
  const currentUser = req.user._id
  if (targetID !== currentUser) {
    res.status(401)
    res.locals.error = 'Unauthorized'
    logger.warn('Unauthorized'.yellow)
    logger.info('[MW] verifySelf-out-0'.bgWhite.blue)
    res.redirect('back')
  }
  logger.info('[MW] verifySelf-out-1'.bgWhite.blue)
  next()
}
/**
 * Asynchronously updates user details based on the input provided in the request body.
 * @param {object} req The request object, containing user input data.
 * @param {object} res The response object, used to send back the updated user data.
 * @param {function} next Callback function to pass control to the next middleware.
 * @returns Calls the next middleware with updated user data or an error.
 */
async function updateUser(req, res, next) {
  logger.info('[MW] updateUser-in'.bgBlue.white)
  try {
    const {
      firstName,
      lastName,
      email,
      theme,
      sortField,
      sortDirection,
      pageSize,
      developer
    } = req.body
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
            pageSize,
            developer
          }
        }
      },
      { new: true }
    )
    res.locals.user = user
    req.login(user, (error) => {
      logger.log(`This is an error ${error}`)
    })
    logger.info('[MW] updateUser-out'.bgWhite.blue)
    return next()
  } catch (error) {
    logger.error(error)
    res.status(500)
    res.locals.error = 'Something went wrong'
    logger.info('[MW] updateUser-out-1'.bgRed.black)
    return next()
  }
}

/**
 * Resets a user's password.
 * This function validates the new password and confirm password fields, hashes the new password, and updates it in the database.
 * @param {object} req - The request object containing the body with user ID, new password, and confirm password.
 * @param {object} res - The response object used to send responses to the client.
 * @param {function} next - The next middleware function in the stack.
 * @returns {Promise<void>} Executes the next middleware function.
 */
async function resetPassword(req, res, next) {
  logger.info('[MW] resetPassword-in'.bgBlue.white)
  // get data from request body
  const { _id, password, confirmPassword } = req.body
  // if new password and confirm password are not set
  if (!password || !confirmPassword) {
    res.locals.message = 'New password and confirm password are required'
    logger.info('[MW] resetPassword-out-1'.bgWhite.blue)
    res.status(400).redirect('back')
    return
  }
  // if new password and confirm password do not match
  if (password !== confirmPassword) {
    res.locals.error = 'New password and confirm password must match'
    logger.info('[MW] resetPassword-out-2'.bgWhite.blue)
    res.status(400).redirect('back')
    return
  }
  const hash = bcrypt.hashSync(password, 10)
  await User.findByIdAndUpdate(_id, { $set: { password: hash } })
  logger.info('[MW] resetPassword-out-4'.bgWhite.blue)
  next()
}
/**
 * Disables a user by setting the isDisabled flag to true in the database.
 * @param {object} req - The request object containing the user ID.
 * @param {object} res - The response object used to send responses to the client.
 * @param {function} next - The next middleware function in the stack.
 * @returns {Promise<void>} Executes the next middleware function.
 */
async function disableUser(req, res, next) {
  logger.info('[MW] disableUser-in'.bgBlue.white)
  await User.findByIdAndUpdate(req.params.id, { $set: { isDisabled: true } })
  logger.info('[MW] disableUser-out'.bgBlue.white)
  next()
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
