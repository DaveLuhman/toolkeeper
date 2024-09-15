import { PendingUser, User } from '../models/index.models.js'
import bcrypt from 'bcrypt'
import { generatePassword } from "./tenant.js"
import { mutateToArray } from './util.js'
import { demoTenantId } from '../config/db.js'
import { toolkeeperCheckoutLink, secret } from '../config/lemonSqueezy.js'

/**
 * getUsers - queries all users from db
 * @param {array} res.locals.users - if id is not provided, find all users
 * @param {*} next
 * @returns {array}
 */
async function getUsers(req, res, next) {
  console.info('[MW] getUsers-in'.bgBlue.white)
  const users = await User.find().where("tenant").equals(req.user.tenant.valueOf())
  res.locals.users = mutateToArray(users)
  console.info('[MW] getUsers-out-2'.bgWhite.blue)
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
  console.info('[MW] getUserByID-in'.bgBlue.white)
  const id = req.params.id
  console.info(`[MW] searching id: ${id}`)
  const user = await User.findById(id)
  res.locals.targetUser = mutateToArray(user)
  console.info('[MW] getUserByID-out'.bgWhite.blue)
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
  console.info('[MW] createUser-in'.bgBlue.white);

  const { firstName, lastName, email, password, confirmPassword, role } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    const error = 'Email and Password are required';
    console.warn(error.yellow);
    res.locals.error = error;
    console.info('[MW] createUser-out-1'.bgWhite.blue);
    return res.status(400).redirect('back');
  }

  // Check if email already exists
  try {
    const existingUser = await User.findOne({ email, tenant: req.user.tenant });
    if (existingUser) {
      const error = 'Email is already registered';
      console.warn(error.yellow);
      res.locals.error = error;
      console.info('[MW] createUser-out-2'.bgWhite.blue);
      return res.status(400).redirect('back');
    }
  } catch (err) {
    console.error(`[MW] Error checking email: ${err.message}`.bgRed.white);
    return next(err); // Pass error to error handler middleware
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    const error = 'Passwords do not match';
    console.warn(error.yellow);
    res.locals.error = error;
    console.info('[MW] createUser-out-3'.bgWhite.blue);
    return res.status(400).redirect('back');
  }

  // Try to create a new user
  try {
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      role,
      tenant: req.user.tenant.valueOf() // Assuming tenant is part of req.user
    });

    console.log(newUser);
    console.info(`Created User ${newUser._id}`.green);
    console.info('[MW] createUser-out-4'.bgWhite.blue);
    return next();
  } catch (err) {
    console.error(`[MW] Error creating user: ${err.message}`.bgRed.white);
    return next(err); // Pass error to error handler middleware
  }
}
/**
 * Creates a new user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the user is created.
 */
async function createPendingUser(req, res, next) {
  console.info('[MW] createPendingUser-in'.bgBlue.white);

  const { firstName, lastName, email, companyName } = req.body;
  const userValues = {firstName, lastName, email, companyName}
  // Check if email and companyName are provided
  if (!email || !companyName) {
    const error = 'Email and Company Name are required';
    console.warn(error.yellow);
    res.locals.error = error;
    console.info('[MW] createPendingUser-out-1'.bgWhite.blue);
    return res.status(400).redirect('back');
  }
  // Check if email already registered
  try {
    const existingUser = await User.findOne({ email  });
    if (existingUser) {
      const error = 'Email is already registered';
      console.warn(error.yellow);
      res.locals.error = error;
      console.info('[MW] createPendingUser-out-2'.bgWhite.blue);
      return res.status(400).redirect('back');
    }
  } catch (err) {
    console.error(`[MW] Error checking email: ${err.message}`.bgRed.white);
    return next(err); // Pass error to error handler middleware
  }
  // Try to create a new user
  try {
    const newUser = await PendingUser.create(userValues);
    console.info(`Created User ${newUser._id}`.green);
    res.redirect(toolkeeperCheckoutLink)
  } catch (err) {
    console.error(`[MW] Error creating user: ${err.message}`.bgRed.white);
    return next(err); // Pass error to error handler middleware
  }
}
/**
 * Verifies if the current user is the same as the target user.
 * @param {object} req The request object.
 * @param {object} res The response object.
 * @param {function} next Callback function to pass control to the next middleware.
 */
function verifySelf(req, res, next) {
  console.info('[MW] verifySelf-in'.bgBlue.white)
  const targetID = req.params.id || req.body._id
  const currentUser = req.user._id
  if (targetID !== currentUser) {
    res.status(401)
    res.locals.error = 'Unauthorized'
    console.warn('Unauthorized'.yellow)
    console.info('[MW] verifySelf-out-0'.bgWhite.blue)
    res.redirect('back')
  }
  console.info('[MW] verifySelf-out-1'.bgWhite.blue)
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
  console.info('[MW] updateUser-in'.bgBlue.white)
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
      console.log(`This is an error ${error}`)
    })
    console.info('[MW] updateUser-out'.bgWhite.blue)
    return next()
  } catch (error) {
    console.error(error)
    res.status(500)
    res.locals.error = 'Something went wrong'
    console.info('[MW] updateUser-out-1'.bgRed.black)
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
  console.info('[MW] resetPassword-in'.bgBlue.white);

  const { _id, password, confirmPassword } = req.body;

  // if new password and confirm password are not set
  if (!password || !confirmPassword) {
    res.locals.message = 'New password and confirm password are required';
    console.info('[MW] resetPassword-out-1'.bgWhite.blue);
    res.status(400).redirect('back');
    return;
  }

  // if new password and confirm password do not match
  if (password !== confirmPassword) {
    res.locals.error = 'New password and confirm password must match';
    console.info('[MW] resetPassword-out-2'.bgWhite.blue);
    res.status(400).redirect('back');
    return;
  }

  try {
        const targetUser = await User.findById(_id);
        targetUser.password = password
        targetUser.save()
    console.info('[MW] resetPassword-out-4'.bgWhite.blue);
    next();
  } catch (error) {
    console.error(`[MW] resetPassword-error: ${error.message}`.bgRed.white);
    res.locals.error = 'An error occurred while resetting the password';
    res.status(500).redirect('back');
  }
}

/**
 * Disables a user by setting the isDisabled flag to true in the database.
 * @param {object} req - The request object containing the user ID.
 * @param {object} res - The response object used to send responses to the client.
 * @param {function} next - The next middleware function in the stack.
 * @returns {Promise<void>} Executes the next middleware function.
 */
async function disableUser(req, res, next) {
  console.info('[MW] disableUser-in'.bgBlue.white)
  await User.findByIdAndUpdate(req.params.id, { $set: { isDisabled: true } })
  console.info('[MW] disableUser-out'.bgBlue.white)
  next()
}
export {
  resetPassword,
  getUsers,
  createUser,
  createPendingUser,
  verifySelf,
  updateUser,
  disableUser,
  getUserByID
}
